"use client";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { redirect } from "next/navigation";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface ICredentials {
    email: string;
    password: string;
  }

  interface IOptions {
    onRequest: () => void;
    onSuccess: () => void;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await authClient.signIn.email(
      {
        email,
        password,
      } as ICredentials,
      {
        onRequest: () => {
          console.log("Signing up...");
        },
        onSuccess: () => {
          redirect("/");
        },
      } as IOptions
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
