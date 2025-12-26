"use client"

import { passwordSchema, PasswordSchemaType } from "@/validation/organizer/changePasswordValidation"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Tooltip } from "../ui/Tooltip";
import { FaInfoCircle, FaLock } from "react-icons/fa";

import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";
import { PROFILE_SERVICE } from "@/services/organizer/profileService";
import { useState } from "react";
import { setPasswordWithOtpSchema, SetPasswordWithOtpSchemaType } from "@/validation/organizer/passwordWithOtpSchema";
import { useAppSelector } from "@/redux/hooks";


interface SecurityTabProp{
  organizerId:string
}

export const SecurityTab = ({organizerId}:SecurityTabProp) => {
  const{
    register,
    handleSubmit,
    formState:{errors},
    reset

  } = useForm<PasswordSchemaType>({
    resolver:zodResolver(passwordSchema)
  });

  const {
  register: registerOtp,
  handleSubmit: handleSubmitOtp,
  formState: { errors: otpErrors },
  reset: resetOtpForm,
} = useForm<SetPasswordWithOtpSchemaType>({
  resolver: zodResolver(setPasswordWithOtpSchema),
});

const hasPassword = useAppSelector(
  (state) => state.organizerAuth.organizer?.hasPassword
);


const [step, setStep] = useState<"REQUEST_OTP" | "SET_PASSWORD" | "CHANGE_PASSWORD">(
  hasPassword ? "CHANGE_PASSWORD" : "REQUEST_OTP"
);


  const onSubmit = async (data: PasswordSchemaType ) => {
    try{
        console.log("submitted ", data);
       
    const result = await PROFILE_SERVICE.updatePassword(organizerId,data)
    if(result) {
      showSuccess(result.data.message)
    console.log("result is ",result)
    reset()
    }
    console.log(organizerId)
    }catch(err){
        if (err instanceof AxiosError && err.response?.data?.message) {
    showError(err.response.data.message);
  } else {
    showError("Something went wrong");
  }

  console.log("err", err);
    }
   

  }


  const onSetPasswordWithOtpSubmit = async (
  data: SetPasswordWithOtpSchemaType
) => {
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


  return (
 
    <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Password & security
      </h2>
        {step === "REQUEST_OTP" && (
  <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
    <h2 className="text-xl font-semibold mb-4">Set Password</h2>

    <p className="text-gray-600 mb-6">
      We’ll send an OTP to your registered email to verify your identity.
    </p>

    <button
      onClick={async () => {
        try {
          await PROFILE_SERVICE.requestPasswordOTP(); 
          showSuccess("OTP sent to your email");
          setStep("SET_PASSWORD");
        } catch (err) {
           console.log(err)
           if(err instanceof AxiosError){
             showError(err.response?.data.message)
           }else{

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

 {step === "SET_PASSWORD" && (
  <form
    onSubmit={handleSubmitOtp(onSetPasswordWithOtpSubmit)}
    className="space-y-5"
  >
    {/* OTP */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        OTP
      </label>
      <input
        type="text"
        {...registerOtp("otp")}
        placeholder="Enter OTP"
        className="w-full border px-4 py-2 rounded-md"
      />
      {otpErrors.otp && (
        <p className="text-red-500 text-sm">
          {otpErrors.otp.message}
        </p>
      )}
    </div>

    {/* New Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
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

    {/* Confirm Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Confirm New Password
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

    <button
      type="submit"
      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
    >
      <FaLock />
      Verify & Set Password
    </button>
  </form>
)}


      {step === "CHANGE_PASSWORD" && ( 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
            </label>
            <input 
                type="password"
                id="currentPassword"
                autoComplete="current-password"
                {...register("currentPassword")}
                placeholder="Enter current password"
                className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.currentPassword ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
          )}
         </div>
         <div>
             <div  className="flex items-center gap-1 mb-1">
                <label htmlFor ="newPassword" className="block text-sm font-medium text-gray-700">
                    new Password
                </label>
                <Tooltip message="Must be 8+characters , include uppercase, lowercase, number & special character.">
                       <FaInfoCircle className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </Tooltip>
             </div>
             <input 
                type="password"
                id="newPassword"
                autoComplete="new-password"
                {...register("newPassword")}
                placeholder="Enter new password"
                className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.newPassword ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
         </div>
          <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            {...register("confirmNewPassword")}
            placeholder="Confirm new password"
            className={`w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.confirmNewPassword ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword.message}</p>
          )}
        </div>

    <button 
       type="submit"
      className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
        <FaLock/>
           Update Password
      </button>

      </form>
      )}
       
    </div>
  )

}