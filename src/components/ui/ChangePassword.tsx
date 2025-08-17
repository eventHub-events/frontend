"use client";

import { useState } from "react";
import * as Yup from "yup";

type ForgetPasswordFormProps = {
  role: "user" | "organizer";
  onSubmit: (data: { password: string; confirmPassword: string }) => void;
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .max(16, "Max 16 characters")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/\d/, "At least one number")
    .matches(/[@$!%*?&]/, "At least one special character"),
  confirmPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ForgetPasswordForm({ role, onSubmit }: ForgetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      onSubmit(formData);
    } catch (err: any) {
      const validationErrors: { [key: string]: string } = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-[60vh] flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Enter your new  Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-purple-600 text-sm hover:underline"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
