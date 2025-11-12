"use client";

export default function OnboardingRefreshPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-yellow-600">⚠️ Onboarding Incomplete</h1>
      <p>Please complete your Stripe onboarding to receive payments.</p>
      <button
        onClick={async () => {
          const res = await fetch("/api/organizer/stripe/onboard", {
            method: "POST",
            body: JSON.stringify({ email: "organizer@example.com" }),
          });
          const data = await res.json();
          window.location.href = data.onboardingUrl;
        }}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
      >
        Resume Onboarding
      </button>
    </div>
  );
}
