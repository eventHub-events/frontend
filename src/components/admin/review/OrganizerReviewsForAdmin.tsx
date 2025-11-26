"use client"

import { useEffect, useState } from "react";
import { reviewService } from "@/services/review/reviewService";
import Pagination from "@/components/ui/Pagination";

import { EventReview, RatingSummaryType } from "@/types/user/review/reviewTypes";
import RatingSummary from "@/components/organizer/review/RatingSummary";
import ReviewsListOrganizer from "@/components/organizer/review/ReviewsListOrganizer";



export default function OrganizerReviewsForAdmin({organizerId, isAdmin}:{organizerId: string, isAdmin?: boolean}){
 
  const[summary,setSummary] = useState<RatingSummaryType| null>(null);
  const[reviews,setReviews] = useState<EventReview[]>([]);
  const[page,setPage]  = useState(1);
  const[totalPages,setTotalPages] = useState(1);
  
  const[loading,setLoading] = useState<boolean>(true);
const limit = 6;
  const fetchSummary = async() => {
    try{
        console.log("organizerId", organizerId)
         const res = await reviewService.getReviewSummary("organizer",organizerId!,);
     setSummary(res.data.data);
     
    }catch(err){
       console.log(err)
    }
   
  }

   const fetchReviews = async (pageNumber: number) => {
     try{
          const page= pageNumber;
          const res = await reviewService.getReviewsForOrganizer(organizerId!,"organizer",page,limit);
          setReviews(res.data.data.reviews);
          setTotalPages(res.data.data.total);
     }catch(err){
        console.log(err);
     }finally{
       setLoading(false);
     }
    }
     useEffect(() => { 
       if(!organizerId)return;
      setLoading(true);
     
       fetchSummary();
       fetchReviews(page);
     },[page]);
    

          if (loading) {
              return (
                  <div className="flex justify-center py-10">
                   <div className="h-8 w-8 animate-spin border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
                  </div>
                 );
            }
          if (!summary) {
              return (
                  <div className="flex justify-center py-10">
                   <div className="h-8 w-8 animate-spin border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
                  </div>
                 );
            }
          

     return (
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Profile Reviews</h1>

      {summary && (
        <RatingSummary
          averageRating={summary.averageRating}
          totalReviews={summary.totalReviews}
          starDistribution={summary.starDistribution}
        />
      )}

      <ReviewsListOrganizer reviews={reviews} isAdmin={isAdmin}refresh={()=>{
                      fetchReviews(page) ;
                      fetchSummary();
                     }
           }  />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
     )
  }
