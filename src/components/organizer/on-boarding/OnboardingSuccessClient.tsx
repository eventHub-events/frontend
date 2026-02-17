"use client";

import { useAppSelector } from "@/redux/hooks";
import { stripeOnboardingService } from "@/services/organizer/stripeOnboarding";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRefreshOrganizer } from "@/hooks/useRefreshOrganizer";
import { useRouter } from "next/navigation";


export default function OnboardingSuccessClient() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const searchParams = useSearchParams();
  const stripeAccountId = searchParams.get("account");
const refreshOrganizer = useRefreshOrganizer();
const router = useRouter();

  useEffect(() => {
    if (!organizer || !stripeAccountId) return;

    (async () => {
      try {
        const res = await stripeOnboardingService.verify(stripeAccountId);
        const isVerified = res.data.data.verified;
        setVerified(res.data.data.verified);
        if (isVerified) {
        // 🔥 refresh redux organizer
        await refreshOrganizer(organizer.id);

        // redirect after refresh
        setTimeout(() => {
          router.push("/organizer/dashboard");
        }, 1500);
      }

      } catch (err) {
        console.error(err);
        setVerified(false);
      }
    })();
  }, [organizer, stripeAccountId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
    <div className="w-full max-w-lg">

      {/* Card */}
      <div className="bg-white shadow-xl rounded-3xl p-10 text-center border border-gray-100 relative overflow-hidden">

        {/* subtle animated background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-100 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-100 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Loader */}
        {verified === null && (
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Verifying your payments setup
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Please wait while we confirm your Stripe onboarding…
            </p>
          </div>
        )}

        {/* SUCCESS */}
        {verified === true && (
          <div className="relative z-10 animate-fadeIn">
            {/* success icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 shadow-inner animate-bounce">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Payments Connected 🎉
            </h1>

            <p className="text-gray-500 mt-3 text-sm">
              Your Stripe account is successfully onboarded.  
              You can now start creating events and receive payouts.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-green-600 text-sm font-medium animate-pulse">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Redirecting to dashboard...
            </div>
          </div>
        )}

        {/* FAILED */}
        {verified === false && (
          <div className="relative z-10 animate-fadeIn">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Onboarding Incomplete
            </h1>

            <p className="text-gray-500 mt-3 text-sm">
              Your Stripe onboarding is not finished yet.  
              Please return and complete the remaining steps.
            </p>

            <button
              onClick={() => router.push("/organizer/profile")}
              className="mt-6 px-6 py-3 bg-black text-white rounded-xl hover:opacity-90 transition font-medium"
            >
              Go Back to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
