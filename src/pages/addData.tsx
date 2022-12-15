import { inferProcedureInput } from "@trpc/server";
import React from "react";
import { AppRouter } from "../server/trpc/router/_app";
import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Add = () => {
  const utils = trpc.useContext();
  const addArticle = trpc.article.add.useMutation({
    async onSuccess() {
      // this guy refetches the articles after they have been added
      await utils.article.invalidate();
    },
  });
  const inputClasses =
    "w-[300px] h-[40px] border-[1px] border-slate-300 rounded-md focus:outline-none";
  const divClasses = "flex flex-col gap-2";
  const labelClasses = "text-lg text-gray-300";
  const { data: sessionData, status } = useSession();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  if (status === "loading") {
    return <p>Loading ...</p>;
  }

  return (
    <React.Fragment>
      <nav className="flex items-center justify-between bg-[#232231]">
        <h3 className="p-5 text-2xl font-light text-white ">T3 Stack</h3>
        {sessionData ? (
          <Link
            href="/addData"
            className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
          >
            Add Data
          </Link>
        ) : (
          <button
            onClick={() => signIn("discord")}
            className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
          >
            Login with Discord
          </button>
        )}
      </nav>
      <main className="min-h-screen  bg-[#232231]">
        {sessionData ? (
          <>
            <div className="itemx-center flex flex-col justify-center">
              <p className="text-center text-2xl text-white">
                {sessionData && (
                  <span>Logged in as {sessionData.user?.name}</span>
                )}
              </p>
              <div className="mt-5 flex items-center justify-center">
                <button
                  onClick={() => signOut()}
                  className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const $form = e.currentTarget;
                const values = Object.fromEntries(new FormData($form));
                type Input = inferProcedureInput<AppRouter["article"]["add"]>;
                const input: Input = {
                  title: values.title as string,
                  description: values.description as string,
                  // imageUrl: values.imageUrl as string,
                  externalUrl: values.external as string,
                };
                try {
                  await addArticle.mutateAsync(input);
                  $form.reset();
                } catch (cause) {
                  console.error({ cause }, "Faled to add Post");
                }
              }}
              className="flex flex-col items-center justify-center pt-5"
            >
              <div className={divClasses}>
                <label className={labelClasses}>Add the Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  disabled={addArticle.isLoading}
                  className={inputClasses}
                />
              </div>
              <div className={divClasses}>
                <label className={labelClasses}>Add the Description</label>
                <textarea
                  name="description"
                  id="description"
                  disabled={addArticle.isLoading}
                  className="w-[300px]  rounded-md border-[1px] border-slate-300 focus:outline-none"
                />
              </div>

              <div className={divClasses}>
                <label className={labelClasses}>Add the External Url</label>
                <input
                  type="text"
                  name="external"
                  id="external"
                  disabled={addArticle.isLoading}
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={addArticle.isLoading}
                className="mt-5 cursor-pointer rounded-md bg-amber-500 px-4 py-2"
              >
                Add The Article
              </button>
            </form>
          </>
        ) : (
          <main className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-gray-300">
              You're not logged In, Please Log In to Continue
            </h1>
            <button
              onClick={() => signIn("discord")}
              className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
            >
              Login with Discord
            </button>
            {/* <button
              onClick={() => signIn("google")}
              className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
            >
              Login with Google
            </button> */}
          </main>
        )}
      </main>
    </React.Fragment>
  );
};

export default Add;
