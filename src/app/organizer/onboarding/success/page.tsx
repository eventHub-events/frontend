
"use client";
import { useAppSelector } from "@/redux/hooks";
import { stripeOnboardingService } from "@/services/organizer/stripeOnboarding";
import { useEffect, useState } from "react";

export default function OnboardingSuccessPage() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);

  useEffect(() => {
      
    (async () => {
           if(!organizer) return
          try{
                const res = await stripeOnboardingService.verify(organizer.id)
          console.log("rerss", res)
          const data =  res.data.data;
      setVerified(data.verified);
          }catch(err){
             console.log(err)
          }
          
    })();
  }, [organizer]);

  return (
    <div className="text-center mt-20">
      {verified === null ? (
        <p>Checking your Stripe onboarding status...</p>
      ) : verified ? (
        <>
          <h1 className="text-2xl font-bold text-green-600">🎉 Onboarding Complete</h1>
          <p>Your account is now ready for payouts.</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600">⚠️ Onboarding Incomplete</h1>
          <p>Please return to Stripe and finish your setup.</p>
        </>
      )}
    </div>
  );
}
