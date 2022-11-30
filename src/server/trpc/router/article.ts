import { router, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { string, z } from 'zod'
import { prisma } from "../../db/client"


const defaultArticleSelect = Prisma.validator<Prisma.ArticlesSelect>()({
    id: true,
    title: true,
    description: true,
    imageUrl: true,
    externalUrl: true
    
});

export const articleRouter = router({
    // all: publicProcedure.query(async () => {
    //     const items = await prisma.articles.findMany();
    //     return {items}
    // }),
    all: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.articles.findMany()
    }),
    list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.articles.findMany({
        select: defaultArticleSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),

    add: publicProcedure
        .input(
            z.object({
                id: z.string().cuid().optional(),
                title: string().min(1).max(30),
                description: string().min(1).max(200),
                externalUrl: string().min(1).max(200),
                imageUrl: string().min(1).max(200),
        }),
    )
        .mutation(async ({ input }) => {
            const article = await prisma.articles.create({
                data: input,
                select: defaultArticleSelect,
            });
            return article
    })
    
})