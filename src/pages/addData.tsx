import { inferProcedureInput } from "@trpc/server";
import React from "react";
import { AppRouter } from "../server/trpc/router/_app";
import { trpc } from "../utils/trpc";

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

  return (
    <React.Fragment>
      <main>
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
        >
          <div>
            <label>Add the Title</label>
            <input
              type="text"
              name="title"
              id="title"
              disabled={addArticle.isLoading}
              className={inputClasses}
            />
          </div>
          <div>
            <label>Add the Description</label>
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
          <div>
            <label>Add the External Url</label>
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
            Add The Damn Article
          </button>
        </form>
      </main>
    </React.Fragment>
  );
};

export default Add;
