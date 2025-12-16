"use client"
import Categories from "@/components/user/landing/Categories";
import EventsList from "@/components/user/landing/UpcomingEventsSection";
import FeaturedEvents from "@/components/user/landing/FeaturedEvents";
import Footer from "@/components/user/landing/Footer";
import Header from "@/components/user/landing/Header";
import HeroSection from "@/components/user/landing/HeroSection";
import SkeletonBlocks from "@/components/user/landing/SkeletonBlocks";
import { useEffect, useState } from "react";


export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000); // demo delay
    return () => clearTimeout(t);
  }, []);
  return (
  <div >
      {loading ? (
        <SkeletonBlocks />
      ) : (
        <>
    <Header/> 
    <HeroSection/>
    <FeaturedEvents/>
    <Categories/>
    <EventsList/>
     <Footer/> 
       </>
      )}
  </div>
  );
}
