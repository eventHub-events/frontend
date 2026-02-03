"use client";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";

import { authService } from "../../services/authService"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { validateConfirmPassword, validateEmail, validateName, validatePassword, validatePhone } from "@/utils/validation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/authSlice";
import { setOrganizer } from "@/redux/slices/organizer/authSlice";



interface SignupPageProps {
  userType: "user" | "organizer";
}

export default function SignupPage({ userType }: SignupPageProps) {
  const isUser = userType === "user";
   const router = useRouter();

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role:userType
  });
  const[errors,setErrors]=useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:""
  })

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  try {
    const token = credentialResponse.credential;
    if (!token) {
      toast.error("Google authentication failed");
      return;
    }

    // Call backend API
    const response = await authService.googleLogin({ token, role: userType });
  
    const { data } = response.data;
    

    // Decide based on role
    if (data.role === "user") {
      dispatch(setUser(data));
      router.push("/user/home");
    } else if (data.role === "organizer") {
      dispatch(setOrganizer(data));
      router.push("/organizer/dashboard");
    }

    toast.success("Google login successful!");
  } catch (error: unknown) {
    console.error("Google login error", error);

    const axiosError = error as AxiosError<{ message: string }>;
    toast.error(axiosError.response?.data?.message || "Google login failed");
  }
};

const handleGoogleError = () => {
  toast.error("Google authentication was cancelled or failed.");
};

  // update form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setForm({ ...form, [e.target.name]: e.target.value });

     const { name, value } = e.target;
  setForm({ ...form, [name]: value });

  // Real-time validation on change
  let error = "";
  switch (name) {
    case "name":
      error = validateName(value);
      break;
    case "email":
      error = validateEmail(value);
      break;
    case "phone":
      error = validatePhone(value);
      break;
    case "password":
      error = validatePassword(value);
      break;
    case "confirmPassword":
      error = validateConfirmPassword(value, form.password);
      break;
  }
  setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
    password: validatePassword(form.password),
    
    confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
  };

  setErrors(newErrors);

  const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
  if (hasErrors) {
    toast.error("Please fix the form errors.");
    return;
  }

  // continue with signup
  try {
    console.log("form is",  form)
    setLoading(true);
    await authService.signup(form);
    toast.success("Please verify your email/OTP.");
    router.push(`/verify-otp/${userType}?email=${encodeURIComponent(form.email)}`);
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err?.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`p-3 rounded-full ${
                isUser
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >
              <span className="text-white text-2xl">📅</span>
            </div>
            <h2
              className={`mt-4 text-2xl font-bold ${
                isUser ? "text-purple-600" : "text-orange-600"
              }`}
            >
              {isUser
                ? "Join as an Event User"
                : "Create Your Organizer Account"}
            </h2>
            <p className="text-gray-500 text-center text-sm mt-2">
              {isUser
                ? "Discover incredible events and create unforgettable memories"
                : "Start creating amazing events and building your community"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"

            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium ${
                isUser
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >
              {loading
                ? "Creating Account..."
                : isUser
                ? "Create User Account"
                : "Create Organizer Account"}
            </button>
          </form>

          {/* Google Button */}
          {/* <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">or continue with</p>
            <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2">
              <FcGoogle />
              <span>Continue with Google</span>
            </button>
          </div> */}
{/* Divider */}
<div className="flex items-center gap-3 my-4">
  <div className="flex-1 h-[1px] bg-gray-300" />
  <span className="text-xs text-gray-400 whitespace-nowrap">
    or continue with
  </span>
  <div className="flex-1 h-[1px] bg-gray-300" />
</div>

{/* Google Login Button */}
     <GoogleLogin
             onSuccess={handleGoogleSuccess}
             onError={handleGoogleError}
             useOneTap
              />



          {/* Already have account */}
          <p className="text-xs text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <Link
              href={`/login/${userType}`}
              className={`${
                isUser ? "text-purple-600" : "text-orange-600"
              } font-medium`}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
