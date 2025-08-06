import Categories from "@/components/user/landing/Categories";
import EventsList from "@/components/user/landing/EventsList";
import FeaturedEvents from "@/components/user/landing/FeaturedEvents";
import Footer from "@/components/user/landing/Footer";
import Header from "@/components/user/landing/Header";
import HeroSection from "@/components/user/landing/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
  <div >
    <Header/> 
    <HeroSection/>
    <FeaturedEvents/>
    <Categories/>
    <EventsList/>
     <Footer/> 
  </div>
  );
}
