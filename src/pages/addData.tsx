import { inferProcedureInput } from "@trpc/server";
import React from "react";
import { AppRouter } from "../server/trpc/router/_app";
import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";

const Add = () => {
  const utils = trpc.useContext();
  const addArticle = trpc.article.add.useMutation({
    async onSuccess() {
      // this guy refetches the articles after they have been added
      await utils.article.invalidate();
    },
  });
  const inputClasses =
    "w-[300px] h-[40px] border-[1px] border-slate-300 rounded-md";
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
      <main className="min-h-screen  bg-[#232231]">
        {sessionData ? (
          <>
            <div className="itemx-center flex flex-col justify-center">
              <p className="text-center text-2xl text-white">
                {sessionData && (
                  <span>Logged in as {sessionData.user?.name}</span>
                )}
              </p>
              <button
                onClick={() => signOut()}
                className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
              >
                Logout
              </button>
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
                  className="w-[300px]  rounded-md border-[1px] border-slate-300"
                />
              </div>
              {/* <div>
            <label>Add the ImageUrl</label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              disabled={addArticle.isLoading}
              className={inputClasses}
            />
          </div> */}
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
