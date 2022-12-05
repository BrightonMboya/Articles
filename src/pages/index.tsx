import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
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
  const command: string = "npm create-t3-app@latest";

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Created with the T3-stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen  bg-[#232231] font-montserrat ">
        <nav>
          <h3 className="p-5 text-2xl font-light text-white ">T3 Stack</h3>
        </nav>

        <section>
          <article className="mt-[2rem] flex flex-col items-center justify-center text-center text-4xl text-white">
            The Best Way to start a{" "}
            <div>
              <span className="text-[#6C84DA]">Full Stack</span>{" "}
              <span className="text-[#9550CC]">TypeSafe</span>
              <br />
              Project
            </div>
          </article>
          <p className="font-regular mt-[2rem] text-center text-xl text-white">
            Move from your crap MERN Stack and join the full stack Type safety
          </p>
          <div className="mt-[2rem] flex items-center justify-center">
            <code
              className=" cursor-pointer rounded-md bg-gray-500 px-4 py-2"
              onClick={() => {
                navigator.clipboard.writeText(command);

                if (!("Notification" in window)) {
                  // Check if the browser supports notifications
                  alert("This browser does not support desktop notification");
                } else if (Notification.permission === "granted") {
                  // Check whether notification permissions have already been granted;
                  // if so, create a notification
                  const notification = new Notification(
                    "Succesfully copied to clipboard!"
                  );
                  // …
                } else if (Notification.permission !== "denied") {
                  // We need to ask the user for permission
                  Notification.requestPermission().then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                      const notification = new Notification(
                        "Succesfully copied to clipboard!"
                      );
                      // …
                    }
                  });
                }
              }}
            >
              npm create-t3-app@latest
            </code>
          </div>
        </section>
        <div className="mt-5 flex items-center justify-center">
          {articlesQuery.isLoading && (
            <p className="text-lg text-white">Loading Some Data ....</p>
          )}

          {articlesQuery.data?.pages.map((page, index) => (
            <section
              key={index}
              className="-center grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
            >
              {page.items.map((item) => (
                <div
                  key={item.id}
                  className="h-[150px] w-[300px] rounded-md  bg-[#293656] shadow-lg"
                >
                  <Link href={item.externalUrl}>
                    <h3 className="px-1 pt-4 pl-5 text-[#9550CC]">
                      {item.title}
                    </h3>
                  </Link>
                  <article className="px-1 pb-4 pl-5 text-gray-300">
                    {item.description}
                  </article>
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
