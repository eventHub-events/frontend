"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setOrganizer } from "@/redux/slices/organizer/authSlice";
import { PROFILE_SERVICE } from "@/services/organizer/profileService";

export const useRefreshOrganizer = () => {
  const dispatch = useAppDispatch();

  const refreshOrganizer = async (organizerId: string) => {
    try {
      if (!organizerId) return;

      const response = await PROFILE_SERVICE.getProfile(organizerId);

      const data = response?.data?.data;
      if (!data) return;
        console.log("ressss", data)
      const org = data.organizerId;

      // 🔥 Update redux with latest backend values
      dispatch(
        setOrganizer({
          id: org._id,
          name: org.name,
          email: org.email,
          role: org.role,
          isVerified: org.isVerified,
          kycStatus: org.kycStatus,
          isKycResubmitted: org.isKycResubmitted,

          // ⭐ IMPORTANT FLAGS
          isProfileCompleted: org.isProfileCompleted,
          isKycSubmitted: org.isKycSubmitted,
          isStripeConnected: org.isStripeConnected,
          isSubscribed: org.isSubscribed,
          hasPassword:org.hasPassword
        })
      );
    } catch (err) {
      console.error("Failed to refresh organizer", err);
    }
  };

  return refreshOrganizer;
};
