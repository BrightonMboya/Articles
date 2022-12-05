import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { trpc } from "../utils/trpc";

const Login: React.FC = () => {
  const { data: sessionData, status } = useSession();
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );
  console.log(sessionData);
  if (status === "loading") {
    return <p>Loading ...</p>;
  }
  return (
    <main className="min-h-screen  bg-[#232231]">
      {sessionData ? (
        <section className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <button
            onClick={() => signOut()}
            className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
          >
            Logout
          </button>
        </section>
      ) : (
        <button
          onClick={() => signIn("discord")}
          className="cursor-pointer rounded-md bg-slate-500 px-4 py-2"
        >
          Login with Discord
        </button>
      )}
    </main>
  );
};

export default Login;
