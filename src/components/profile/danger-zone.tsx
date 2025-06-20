"use client";

import { useState, useTransition } from "react";
import {
  Trash2,
  LogOut,
  Shield,
  AlertTriangle,
  Download,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteAccount, exportUserData } from "@/app/actions/profile-actions";
import { authClient } from "@/lib/auth-client";

interface DangerZoneProps {
  userId: string;
}

export function DangerZone({ userId }: DangerZoneProps) {
  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const clearFeedback = () => {
    setTimeout(() => setFeedback({ type: null, message: "" }), 3000);
  };

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await authClient.signOut();
        setFeedback({ type: "success", message: "Successfully signed out!" });
        clearFeedback();
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } catch (error) {
        console.error("Error logging out:", error);
        setFeedback({
          type: "error",
          message: "Failed to sign out. Please try again.",
        });
        clearFeedback();
      }
    });
  };

  const handleExportData = () => {
    startTransition(async () => {
      try {
        const jsonData = await exportUserData(userId);

        // Create and download the file
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `user-data-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setFeedback({
          type: "success",
          message: "Data exported successfully!",
        });
        clearFeedback();
      } catch (error) {
        console.error("Error exporting data:", error);
        setFeedback({
          type: "error",
          message: "Failed to export data. Please try again.",
        });
        clearFeedback();
      }
    });
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (deleteConfirmation.toLowerCase() !== "delete") {
      setFeedback({
        type: "error",
        message: "Please type 'DELETE' to confirm account deletion.",
      });
      clearFeedback();
      return;
    }

    startTransition(async () => {
      try {
        await deleteAccount(userId);
        await authClient.signOut();
        setFeedback({
          type: "success",
          message: "Account deleted successfully. Redirecting...",
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Error deleting account:", error);
        setFeedback({
          type: "error",
          message: "Failed to delete account. Please try again.",
        });
        clearFeedback();
        setShowDeleteConfirm(false);
        setDeleteConfirmation("");
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

      {/* Feedback Message */}
      {feedback.type && (
        <div
          className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {feedback.type === "success" && <CheckCircle className="w-4 h-4" />}
          {feedback.type === "error" && <AlertTriangle className="w-4 h-4" />}
          <span className="text-sm">{feedback.message}</span>
        </div>
      )}

      <div className="space-y-4">

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
              className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? "Signing Out..." : "Sign Out"}
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
              className={`px-4 py-2 border rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                showDeleteConfirm
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
              }`}
            >
              {isPending
                ? "Deleting..."
                : showDeleteConfirm
                ? "Confirm Delete"
                : "Delete"}
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 space-y-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">
                    This action cannot be undone. All your data will be
                    permanently deleted.
                  </span>
                </div>
                <div className="text-gray-400 text-sm">
                  Type{" "}
                  <span className="font-mono bg-gray-800 px-1 rounded">
                    DELETE
                  </span>{" "}
                  to confirm:
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50"
                  disabled={isPending}
                />
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmation("");
                  }}
                  disabled={isPending}
                  className="px-3 py-2 text-gray-400 hover:text-white text-sm border border-gray-600/50 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
