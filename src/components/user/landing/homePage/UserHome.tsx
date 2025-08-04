"use client"
import { withRoleProtection } from "../../auth/RoleProtection"
import Categories from "../Categories"
import EventsList from "../EventsList"
import FeaturedEvents from "../FeaturedEvents"
import HeroSection from "../HeroSection"





const UserHome=()=>{
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
export  default withRoleProtection(UserHome,["user"])