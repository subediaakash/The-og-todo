"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Target,
  Shield,
  Key,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  // Debug logging
  console.log("Reset password form - token from URL:", token);
  console.log("Reset password form - error from URL:", error);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if token exists
    if (!token) {
      setErrors({
        submit:
          "Invalid or missing reset token. Please request a new password reset link.",
      });
      return;
    }

    setIsPending(true);

    try {
      console.log("Attempting to reset password with token:", token);
      console.log("New password length:", password.length);

      await authClient.resetPassword({
        newPassword: password,
        token: token, // ← This is required by Better Auth!
      });
      console.log("Password reset successful");
      setIsSuccess(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrors({
        submit: "Failed to reset password. The link may have expired.",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

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
                  Password Reset Successful!
                </h2>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your password has been successfully updated. You can now sign
                  in with your new password.
                </p>

                <Link
                  href="/login"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Continue to Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === "INVALID_TOKEN" || error === "invalid_token") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative w-full max-w-md z-10">
          <div className="text-center mb-10">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                  <Target className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent">
                  OG-TODO
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-600 rounded-full mt-1" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-xl" />

            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Invalid Reset Link
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  This password reset link is invalid or has expired. Please
                  request a new reset link.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/forgot-password"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Request New Reset Link
                  </Link>
                  <Link
                    href="/login"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Back to Sign In
                  </Link>
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                OG-TODO
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mt-1" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-6 font-light">
            Create your new password
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure Reset</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Key className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Strong Password</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Account Recovery</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />

          {/* Form */}
          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Reset Password
              </h2>
              <p className="text-gray-400">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <Lock className="w-4 h-4 inline mr-2 text-purple-400" />
                  New Password
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
                    placeholder="Enter your new password"
                    disabled={isPending}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= level
                              ? passwordStrength < 3
                                ? "bg-red-500"
                                : passwordStrength < 4
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">
                      Password strength:{" "}
                      <span
                        className={
                          passwordStrength < 3
                            ? "text-red-400"
                            : passwordStrength < 4
                              ? "text-yellow-400"
                              : "text-green-400"
                        }
                      >
                        {passwordStrength < 3
                          ? "Weak"
                          : passwordStrength < 4
                            ? "Medium"
                            : "Strong"}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <Lock className="w-4 h-4 inline mr-2 text-purple-400" />
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 ${
                      errors.confirmPassword
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Confirm your new password"
                    disabled={isPending}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.confirmPassword}
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
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Update Password
                  </>
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
