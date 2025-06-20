"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  CheckCircle,
  Target,
  Flame,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  interface ICredentials {
    email: string;
    password: string;
  }

  interface IOptions {
    onRequest: () => void;
    onSuccess: () => void;
    onError?: (error: any) => void;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    startTransition(async () => {
      try {
        await authClient.signIn.email(
          {
            email,
            password,
          } as ICredentials,
          {
            onRequest: () => {
              console.log("Signing in...");
            },
            onSuccess: () => {
              router.push("/");
            },
            onError: (error) => {
              setErrors({
                submit: "Invalid email or password. Please try again.",
              });
            },
          } as IOptions
        );
      } catch (error) {
        console.log(error);
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative w-full max-w-md z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                OG-TODO
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-1" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-6 font-light">
            Welcome back to your productivity hub
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Create Todos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Build Streaks</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Track Commitments</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-xl" />

          {/* Form */}
          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">
                Continue your productivity journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2 text-blue-400" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                      errors.email
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Enter your email"
                    disabled={isPending}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <Lock className="w-4 h-4 inline mr-2 text-purple-400" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Enter your password"
                    disabled={isPending}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    {errors.submit}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 rounded-xl font-semibold transition-all duration-500 hover:scale-[1.02] shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-r from-transparent via-black to-transparent text-gray-400">
                  New to OG-TODO?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>Create your free account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 OG-TODO • Built for productivity enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
