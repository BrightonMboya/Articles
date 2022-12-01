import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { articleRouter } from "./article";

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
  healthcheck: publicProcedure.query(() => "Yay!!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
