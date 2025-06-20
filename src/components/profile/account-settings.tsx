"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { User, Mail, Bell, Globe, Palette, Save } from "lucide-react";
import { updateUserProfile } from "@/app/actions/profile-actions";
import type { User as UserType } from "@/generated/prisma";

interface AccountSettingsProps {
  user: UserType;
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateUserProfile(user.id, formData);
        // Show success message
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <User className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Account Settings</h3>
          <p className="text-gray-400 text-sm">
            Manage your account information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={isPending}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full bg-[#0a0a0a] border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={isPending}
          />
        </div>

   

        {/* Save Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
