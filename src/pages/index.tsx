import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import BlurImage from "../components/BlurImage";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const articlesQuery = trpc.article.list.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    }
  );

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Created with the T3-stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div>
          {articlesQuery.data?.pages.map((page, index) => (
            <section key={index} className="grid grid-cols-1 gap-5">
              {page.items.map((item) => (
                <div
                  key={item.id}
                  className="w-[300px] rounded-md border-[1px] border-slate-200 shadow-md"
                >
                  <div className="relative h-[200px] w-[300px] rounded-t-md">
                    <BlurImage imageUrl={item.imageUrl} />
                  </div>
                  <Link href={item.externalUrl}>
                    <h3 className="px-1 pt-4 font-bold">{item.title}</h3>
                  </Link>
                  <article className="px-1 pb-4">{item.description}</article>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
