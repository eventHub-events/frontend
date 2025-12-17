import OnboardingSuccessClient from "@/components/organizer/on-boarding/OnboardingSuccessClient";
import { Suspense } from "react";


export default function OnboardingSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <OnboardingSuccessClient />
    </Suspense>
  );
}
