"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOrganizer } from "@/redux/slices/organizer/authSlice";
import { subscriptionService } from "@/services/organizer/subscriptionService";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // ✅ get organizer from redux
  const organizer = useAppSelector(state => state.organizerAuth.organizer);
  const organizerId = organizer?.id;

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        if (!organizerId) {
          console.log("organizerId missing from redux");
          return;
        }

        console.log("organizerId:", organizerId);

        // 🔥 call backend
        const res = await subscriptionService.fetchCurrentSubscription(organizerId);
        const sub = res.data.data;

        if (!sub) return;

        // 🔥 update redux organizer
        dispatch(setOrganizer({
          ...organizer,
          isSubscribed: true
        }));

        // redirect dashboard
        setTimeout(() => {
          router.replace("/organizer/dashboard");
        }, 2000);

      } catch (err) {
        console.log(err);
      }
    };

    verifySubscription();
  }, [organizerId]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-green-600">
        🎉 Payment Successful!
      </h1>
      <p>Your subscription has been activated successfully.</p>
      <p className="mt-3 text-gray-500">Redirecting to dashboard...</p>
    </div>
  );
}
