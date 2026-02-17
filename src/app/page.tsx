"use client";

import Categories from "@/components/user/landing/Categories";
import EventsList from "@/components/user/landing/UpcomingEventsSection";
import FeaturedEvents from "@/components/user/landing/FeaturedEvents";
import Footer from "@/components/user/landing/Footer";
import Header from "@/components/user/landing/Header";
import HeroSection from "@/components/user/landing/HeroSection";
import SkeletonBlocks from "@/components/user/landing/SkeletonBlocks";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);

  const [loading, setLoading] = useState(true);

  // 🔥 PROTECTION: prevent logged users seeing landing page
  useEffect(() => {
    // USER redirect
    if (user) {
      router.replace("/user/home");
      return;
    }

    // ORGANIZER redirect
    if (organizer) {
      if (!organizer.isProfileCompleted) {
        router.replace("/organizer/profile");
        return;
      }

      if (!organizer.isKycSubmitted) {
        router.replace("/organizer/profile?step=documents");
        return;
      }

      if (!organizer.isSubscribed) {
        router.replace("/organizer/subscription");
        return;
      }

      router.replace("/organizer/dashboard");
      return;
    }

    // landing skeleton loading
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, [user, organizer, router]);

  return (
    <div>
      {loading ? (
        <SkeletonBlocks />
      ) : (
        <>
          <Header />
          <HeroSection />
          <FeaturedEvents />
          <Categories />
          <EventsList />
          <Footer />
        </>
      )}
    </div>
  );
}
