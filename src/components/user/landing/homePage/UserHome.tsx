"use client"

import Categories from "../Categories"
import EventsList from "../EventsList"
import FeaturedEvents from "../FeaturedEvents"
import HeroSection from "../HeroSection"






export  const UserHome=()=>{
  return (
    <div>
      <main>
         
    <HeroSection/>
    <FeaturedEvents/>
    <Categories/>
    <EventsList/>
      </main>
    </div>
  )
}
