import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://general-todo.vercel.app/";

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, useSession } = createAuthClient();
