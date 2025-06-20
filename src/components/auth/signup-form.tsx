"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserPlus,
  Target,
  ArrowRight,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import Link from "next/link";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  interface SignUpDetails {
    email: string;
    password: string;
    name: string;
  }

  interface SignUpCallbacks {
    onRequest: () => void;
    onSuccess: () => void;
    onError?: (error: any) => void;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

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

    startTransition(async () => {
      try {
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
            onError: (error) => {
              setErrors({
                submit: "Failed to create account. Please try again.",
              });
            },
          } as SignUpCallbacks
        );
      } catch (error) {
        setErrors({ submit: "Something went wrong. Please try again." });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    // Clear errors when user starts typing
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
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl">
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent">
                OG-TODO
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full mt-1" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-300 mb-6 font-light">
            Start your productivity journey today
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Free Forever</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">No Ads</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-xl" />

          {/* Form */}
          <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">
                Join thousands of productive users
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  <User className="w-4 h-4 inline mr-2 text-green-400" />
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 group-hover:border-gray-600 ${
                      errors.name
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Enter your full name"
                    disabled={isPending}
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors" />

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.name}
                  </div>
                )}
              </div>

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
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 group-hover:border-gray-600 ${
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
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 group-hover:border-gray-600 ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Create a strong password"
                    disabled={isPending}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength >= level
                              ? passwordStrength <= 2
                                ? "bg-red-500 shadow-sm shadow-red-500/50"
                                : passwordStrength <= 3
                                ? "bg-yellow-500 shadow-sm shadow-yellow-500/50"
                                : "bg-green-500 shadow-sm shadow-green-500/50"
                              : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Password strength:{" "}
                      {passwordStrength <= 2
                        ? "Weak"
                        : passwordStrength <= 3
                        ? "Medium"
                        : "Strong"}
                    </p>
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
                  <Lock className="w-4 h-4 inline mr-2 text-orange-400" />
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full bg-black/50 border rounded-xl px-4 py-4 pl-12 pr-12 text-white placeholder-gray-500 transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 group-hover:border-gray-600 ${
                      errors.confirmPassword
                        ? "border-red-500/50 focus:ring-red-500/50"
                        : "border-gray-700/50"
                    }`}
                    placeholder="Confirm your password"
                    disabled={isPending}
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-400 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                  {/* Input Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-left-2 duration-300">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Terms and Privacy */}
              <div className="text-sm text-gray-400 bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                <p>
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-green-400 hover:text-green-300 transition-colors hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
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
                className="group relative w-full bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 rounded-xl font-semibold transition-all duration-500 hover:scale-[1.02] shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Create Account</span>
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link
                href="/sign-in"
                className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>Sign in to your account</span>
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

export default SignUpForm;
