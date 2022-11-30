import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { articleRouter } from "./article";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  article: articleRouter,
  healthCheck: publicProcedure.query(() => "Yay!!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
