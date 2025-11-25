"use client";

import { useState, useEffect } from "react";
import Categories from "../Categories";
import EventsList from "../EventsList";
import FeaturedEvents from "../FeaturedEvents";
import HeroSection from "../HeroSection";
import SkeletonBlocks from "../SkeletonBlocks";

export const UserHome = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000); // demo delay
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      {loading ? (
        <SkeletonBlocks />
      ) : (
        <>
          <HeroSection />
          <FeaturedEvents />
          <Categories />
          <EventsList />
        </>
      )}
    </main>
  );
};
