"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordSchemaType } from "@/validation/organizer/changePasswordValidation";
import { FaEye, FaEyeSlash, FaLock, FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "@/components/ui/Tooltip";

import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";
import { PROFILE_SERVICE } from "@/services/organizer/profileService";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { USER_PROFILE_SERVICE } from "@/services/user/userProfileService";
import { userLogout } from "@/redux/slices/user/authSlice";
import { setPasswordWithOtpSchema, SetPasswordWithOtpSchemaType } from "@/validation/organizer/passwordWithOtpSchema";

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
  const hasPassword = useAppSelector(
  state => state.auth.user?.hasPassword
);
type PasswordStep = "REQUEST_OTP" | "SET_PASSWORD" | "CHANGE_PASSWORD";

const [step, setStep] = useState<PasswordStep>(
  hasPassword ? "CHANGE_PASSWORD" : "REQUEST_OTP"
);
const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
  });
const otpForm = useForm<SetPasswordWithOtpSchemaType>({
  resolver: zodResolver(setPasswordWithOtpSchema),
});

  const onSubmit = async (data: PasswordSchemaType) => {
    try {
      const result = await PROFILE_SERVICE.updatePassword(userId, data);
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
const onSetPasswordWithOtp = async ( data:{otp: string,newPassword :string; confirmNewPassword: string}) => {
  try {
    await USER_PROFILE_SERVICE.userSetPasswordWithOtp(data);
     console.log("data is", data)
    showSuccess("Password set successfully. Please login again.");
    
    // IMPORTANT: force re-auth
    dispatch(userLogout());
    window.location.href = "/login/user";
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data?.message) {
      showError(err.response.data.message);
    } else {
      showError("Invalid OTP or password");
    }
  }
};
React.useEffect(() => {
  if (hasPassword !== undefined) {
    setStep(hasPassword ? "CHANGE_PASSWORD" : "REQUEST_OTP");
  }
}, [hasPassword]);

  return (
    <div className="max-w-2xl space-y-8 bg-white p-6 rounded-2xl shadow-md">
      {/* Title */}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Password & Security
      </h2>

      {/* Password Change Form */}
    {step === "REQUEST_OTP" && (
  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6 shadow-sm space-y-5">
    {/* Header */}
    <div className="space-y-1">
      <h3 className="text-xl font-semibold text-gray-900">
        Secure Your Account
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        You signed up using Google. To enable password login, we’ll send a
        one-time verification code to your registered email.
      </p>
    </div>

    {/* Info Row */}
    <div className="flex items-center gap-3 bg-white/80 border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold">
        OTP
      </div>
      <div className="text-sm text-gray-700">
        Check your inbox for a 6-digit code
      </div>
    </div>

    {/* Action */}
    <button
      onClick={async () => {
        try {
          await USER_PROFILE_SERVICE.userRequestPasswordSetOtp();
          showSuccess("OTP sent to your email");
          setStep("SET_PASSWORD");
        } catch {
          showError("Failed to send OTP");
        }
      }}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
    >
      Send Verification Code
    </button>

    {/* Footer hint */}
    <p className="text-xs text-gray-500 text-center">
      Didn’t receive the email? Check spam or try again in a moment.
    </p>
  </div>
)}

{step === "SET_PASSWORD" && (
  <form
    onSubmit={otpForm.handleSubmit(onSetPasswordWithOtp)}
    className="space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100 shadow-sm"
  >
    {/* Header */}
    <div className="space-y-1">
      <h3 className="text-xl font-semibold text-gray-900">
        Set Your Password
      </h3>
      <p className="text-sm text-gray-600">
        We’ve sent a one-time code to your email. Enter it below to secure your account.
      </p>
    </div>

    {/* OTP */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        One-Time Password (OTP)
      </label>
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        {...otpForm.register("otp")}
        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
          otpForm.formState.errors.otp
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-purple-200"
        } transition-all`}
      />
      {otpForm.formState.errors.otp && (
        <p className="text-red-500 text-sm mt-1">
          {otpForm.formState.errors.otp.message}
        </p>
      )}
    </div>

    {/* New Password */}
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-sm font-medium text-gray-700">
          New Password
        </label>
        <Tooltip message="At least 8 characters with uppercase, lowercase, number & symbol">
          <FaInfoCircle className="text-gray-400 cursor-pointer" />
        </Tooltip>
      </div>
      <input
        type="password"
        placeholder="Create a strong password"
        {...otpForm.register("newPassword")}
        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
          otpForm.formState.errors.newPassword
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-purple-200"
        } transition-all`}
      />
      {otpForm.formState.errors.newPassword && (
        <p className="text-red-500 text-sm mt-1">
          {otpForm.formState.errors.newPassword.message}
        </p>
      )}
    </div>

    {/* Confirm Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Confirm Password
      </label>
      <input
        type="password"
        placeholder="Re-enter password"
        {...otpForm.register("confirmNewPassword")}
        className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 ${
          otpForm.formState.errors.confirmNewPassword
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-purple-200"
        } transition-all`}
      />
      {otpForm.formState.errors.confirmNewPassword && (
        <p className="text-red-500 text-sm mt-1">
          {otpForm.formState.errors.confirmNewPassword.message}
        </p>
      )}
    </div>

    {/* Action */}
    <button
      type="submit"
      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
    >
      Verify & Set Password
    </button>

    {/* Helper */}
    <p className="text-xs text-gray-500 text-center">
      You’ll be redirected to login after setting your password.
    </p>
  </form>
)}


       {step === "CHANGE_PASSWORD" && (
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
       )}
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
