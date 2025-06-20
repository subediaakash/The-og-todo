"use client";

import { useState, useTransition } from "react";
import { Trash2, LogOut, Shield, AlertTriangle, Download } from "lucide-react";

import {
  deleteAccount,
  logoutUser,
  exportUserData,
} from "@/app/actions/profile-actions";

interface DangerZoneProps {
  userId: string;
}

export function DangerZone({ userId }: DangerZoneProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
  };

  const handleExportData = () => {
    startTransition(async () => {
      try {
        await exportUserData(userId);
      } catch (error) {
        console.error("Error exporting data:", error);
      }
    });
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    startTransition(async () => {
      try {
        await deleteAccount(userId);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    });
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Account Management</h3>
          <p className="text-gray-400 text-sm">Manage your account and data</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Export Data */}
        <div className="p-4 bg-[#0a0a0a] border border-gray-600/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-white font-medium">Export Your Data</div>
                <div className="text-gray-400 text-sm">
                  Download all your data in JSON format
                </div>
              </div>
            </div>
            <button
              onClick={handleExportData}
              disabled={isPending}
              className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              Export
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 bg-[#0a0a0a] border border-gray-600/50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-white font-medium">Sign Out</div>
                <div className="text-gray-400 text-sm">
                  Sign out of your account on this device
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <div className="text-white font-medium">Delete Account</div>
                <div className="text-gray-400 text-sm">
                  Permanently delete your account and all data
                </div>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={isPending}
              className={`px-4 py-2 border rounded-lg transition-all hover:scale-105 disabled:opacity-50 ${
                showDeleteConfirm
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
              }`}
            >
              {showDeleteConfirm ? "Confirm Delete" : "Delete"}
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </span>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="mt-2 text-gray-400 hover:text-white text-sm underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
