"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaInfoCircle, FaLock } from "react-icons/fa";
import { AxiosError } from "axios";

import {
  passwordSchema,
  PasswordSchemaType,
} from "@/validation/organizer/changePasswordValidation";
import {
  setPasswordWithOtpSchema,
  SetPasswordWithOtpSchemaType,
} from "@/validation/organizer/passwordWithOtpSchema";

import { Tooltip } from "../ui/Tooltip";
import { PROFILE_SERVICE } from "@/services/organizer/profileService";
import { showError, showSuccess } from "@/utils/toastService";
import { useAppSelector } from "@/redux/hooks";

interface SecurityTabProps {
  organizerId: string;
}

type Step = "REQUEST_OTP" | "SET_PASSWORD" | "CHANGE_PASSWORD";

export const SecurityTab = ({ organizerId }: SecurityTabProps) => {
  /* ------------------ GLOBAL STATE ------------------ */
  const hasPassword = useAppSelector(
    (state) => state.organizerAuth.organizer?.hasPassword
  );

  /* ------------------ STEP CONTROL ------------------ */
  const [step, setStep] = useState<Step>(() =>
    hasPassword ? "CHANGE_PASSWORD" : "REQUEST_OTP"
  );

  /* ------------------ NORMAL PASSWORD FORM ------------------ */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
  });

  /* ------------------ OTP PASSWORD FORM ------------------ */
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm<SetPasswordWithOtpSchemaType>({
    resolver: zodResolver(setPasswordWithOtpSchema),
  });

  /* ------------------ HANDLERS ------------------ */

  // Normal user → change password
  const onChangePassword = async (data: PasswordSchemaType) => {
    try {
      const res = await PROFILE_SERVICE.updatePassword(organizerId, data);
      showSuccess(res.data.message);
      reset();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Failed to update password");
      }
    }
  };

  // Google user → set password with OTP
  const onSetPasswordWithOtp = async (data: SetPasswordWithOtpSchemaType) => {
    try {
      await PROFILE_SERVICE.setPasswordWithOtp(data);
      showSuccess("Password set successfully. Please login again.");
      window.location.href = "/login/organizer";
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError("Invalid OTP or password");
      }
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Password & Security
      </h2>

      {/* Google login info */}
      {!hasPassword && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-3 rounded-md mb-6">
          You signed up using Google. Please verify OTP before setting a password.
        </div>
      )}

      {/* ---------------- REQUEST OTP ---------------- */}
      {step === "REQUEST_OTP" && !hasPassword && (
        <div>
          <p className="text-gray-600 mb-4">
            We will send an OTP to your registered email.
          </p>

          <button
            onClick={async () => {
              try {
                await PROFILE_SERVICE.requestPasswordOTP();
                showSuccess("OTP sent to your email");
                setStep("SET_PASSWORD");
              } catch (err) {
                if (err instanceof AxiosError) {
                  showError(err.response?.data.message);
                } else {
                  showError("Failed to send OTP");
                }
              }
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Send OTP
          </button>
        </div>
      )}

      {/* ---------------- SET PASSWORD WITH OTP ---------------- */}
      {step === "SET_PASSWORD" && !hasPassword && (
        <form
          onSubmit={handleSubmitOtp(onSetPasswordWithOtp)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              {...registerOtp("otp")}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Enter OTP"
            />
            {otpErrors.otp && (
              <p className="text-red-500 text-sm">
                {otpErrors.otp.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              {...registerOtp("newPassword")}
              className="w-full border px-4 py-2 rounded-md"
            />
            {otpErrors.newPassword && (
              <p className="text-red-500 text-sm">
                {otpErrors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...registerOtp("confirmNewPassword")}
              className="w-full border px-4 py-2 rounded-md"
            />
            {otpErrors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {otpErrors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2">
            <FaLock />
            Verify & Set Password
          </button>
        </form>
      )}

      {/* ---------------- CHANGE PASSWORD ---------------- */}
      {step === "CHANGE_PASSWORD" && hasPassword && (
        <form
          onSubmit={handleSubmit(onChangePassword)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type="password"
              {...register("currentPassword")}
              className="w-full border px-4 py-2 rounded-md"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-sm font-medium">New Password</label>
              <Tooltip message="Must be 8+ characters with uppercase, lowercase, number & special character">
                <FaInfoCircle className="text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
            <input
              type="password"
              {...register("newPassword")}
              className="w-full border px-4 py-2 rounded-md"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmNewPassword")}
              className="w-full border px-4 py-2 rounded-md"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2">
            <FaLock />
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};
