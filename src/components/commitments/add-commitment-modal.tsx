"use client";

import type React from "react";
import { useState, useTransition } from "react";
import {
  X,
  Calendar,
  Flag,
  Tag,
  Plus,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { addCommitment } from "@/app/actions/commitment-actions";

interface AddCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function AddCommitmentModal({
  isOpen,
  onClose,
  userId,
}: AddCommitmentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    startTransition(async () => {
      try {
        await addCommitment(userId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority.toUpperCase() as
            | "LOW"
            | "MEDIUM"
            | "HIGH",
          category: formData.category.trim(),
          dueDate: new Date(formData.dueDate),
        });

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          setFormData({
            title: "",
            description: "",
            priority: "medium",
            category: "",
            dueDate: "",
          });
          setErrors({});
        }, 1500);
      } catch (error) {
        console.error("Error adding commitment:", error);
        setErrors({ submit: "Failed to add commitment. Please try again." });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-red-600";
      case "medium":
        return "from-yellow-500 to-yellow-600";
      case "low":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const categories = [
    "Health",
    "Work",
    "Personal",
    "Learning",
    "Finance",
    "Relationships",
    "Hobbies",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-700/50 rounded-3xl p-8 w-full max-w-lg shadow-2xl shadow-black/50 transform transition-all duration-300 scale-100">
        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl" />

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Commitment Added!
              </h3>
              <p className="text-gray-400">
                Your new commitment has been created successfully.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                New Commitment
              </h2>
              <p className="text-gray-400 text-sm">
                Create a goal to track your progress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <Sparkles className="w-4 h-4 inline mr-2 text-blue-400" />
              Title *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-4 text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                  errors.title
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-gray-600/50"
                }`}
                placeholder="What do you want to commit to?"
                disabled={isPending}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <Tag className="w-4 h-4 inline mr-2 text-purple-400" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-gray-600/50 rounded-xl px-4 py-4 text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
              placeholder="Describe your commitment in detail..."
              disabled={isPending}
            />
          </div>

          {/* Priority & Category Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Flag className="w-4 h-4 inline mr-2 text-orange-400" />
                Priority
              </label>
              <div className="relative">
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full bg-[#0a0a0a] border border-gray-600/50 rounded-xl px-4 py-4 text-white transition-all duration-200 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none cursor-pointer"
                  disabled={isPending}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(
                    formData.priority
                  )}`}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">
                <Tag className="w-4 h-4 inline mr-2 text-cyan-400" />
                Category *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  list="categories"
                  className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-4 text-white placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 ${
                    errors.category
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-gray-600/50"
                  }`}
                  placeholder="Choose or type..."
                  disabled={isPending}
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">
              <Calendar className="w-4 h-4 inline mr-2 text-green-400" />
              Due Date *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                min={
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                } // Tomorrow
                className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-4 text-white transition-all duration-200 focus:ring-2 focus:ring-green-500/50 focus:border-green-500 ${
                  errors.dueDate
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-gray-600/50"
                }`}
                disabled={isPending}
              />
              {errors.dueDate && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.dueDate}
                </div>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Commitment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
