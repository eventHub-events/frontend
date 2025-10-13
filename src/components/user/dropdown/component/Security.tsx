"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordSchemaType } from "@/validation/organizer/changePasswordValidation";
import { FaEye, FaEyeSlash, FaLock, FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "@/components/ui/Tooltip";
import { profileService } from "@/services/organizer/profileService";
import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";

interface SecurityTabProps {
  userId: string;
  twoFA: boolean;
  setTwoFA: (value: boolean) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  userId,
  twoFA,
  setTwoFA,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordSchemaType) => {
    try {
      const result = await profileService.updatePassword(userId, data);
      if (result) {
        showSuccess(result.data.message);
        reset();
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Something went wrong");
      }
      console.error("Error updating password:", err);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 bg-white p-6 rounded-2xl shadow-md">
      {/* Title */}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Password & Security
      </h2>

      {/* Password Change Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter current password"
              autoComplete="current-password"
              {...register("currentPassword")}
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-purple-200"
              } transition-all duration-200 shadow-sm`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <Tooltip message="Must be 8+ characters, include uppercase, lowercase, number & special character.">
              <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            </Tooltip>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              {...register("newPassword")}
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-purple-200"
              } transition-all duration-200 shadow-sm`}
            />
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              autoComplete="new-password"
              {...register("confirmNewPassword")}
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                errors.confirmNewPassword
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-purple-200"
              } transition-all duration-200 shadow-sm`}
            />
          </div>
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <FaLock />
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* Two-Factor Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
