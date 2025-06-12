"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface SignUpDetails {
    email: string;
    password: string;
    name: string;
  }

  interface SignUpCallbacks {
    onRequest: () => void;
    onSuccess: () => void;
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      } as SignUpDetails,
      {
        onRequest: () => {
          console.log("Signing up...");
        },
        onSuccess: () => {
          redirect("/");
        },
      } as SignUpCallbacks
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
