"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  Target,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
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
        await authClient.forgetPassword({
          email,
          redirectTo: "/reset-password",
        });
        setIsSuccess(true);
      } catch (error) {
        setErrors({
          submit: "Failed to send reset email. Please try again.",
        });
      }
    });
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative w-full max-w-md z-10">
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent">
                  OG-TODO
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full mt-1" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-xl" />

            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">
                  Check Your Email
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  We've sent a password reset link to{" "}
                  <span className="text-green-400 font-medium">{email}</span>
                </p>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>The link will expire in 15 minutes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>

                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium transition-all duration-300"
                  >
                    Try Different Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative w-full max-w-md z-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-100 to-blue-100 bg-clip-text text-transparent">
                OG-TODO
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-blue-600 rounded-full mt-1" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-6 font-light">
            Reset your password securely
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure Process</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Email Verification</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Quick Reset</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-orange-500/10 rounded-3xl blur-xl" />

          {/* Form */}
          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-400">
                Enter your email to receive a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2 text-orange-400" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 ${
                      errors.email
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Enter your email address"
                    disabled={isPending}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.submit}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-700 disabled:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
