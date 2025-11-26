import { useEffect, useState } from "react";
import RatingSummary from "./RatingSummary";
import { reviewService } from "@/services/review/reviewService";
import Pagination from "@/components/ui/Pagination";
import ReviewsListOrganizer from "./ReviewsListOrganizer";
import { EventReview, RatingSummaryType } from "@/types/user/review/reviewTypes";

export interface OrganizerEventReviewProps {
   eventId : string;
   isAdmin?: boolean
}
export default function OrganizerEventReview({eventId, isAdmin}: OrganizerEventReviewProps){
 
  const[summary,setSummary] = useState<RatingSummaryType | null>(null);
  const[reviews,setReviews] = useState<EventReview[]>([]);
  const[page,setPage]  = useState(1);
  const[totalPages,setTotalPages] = useState(1);
const limit = 6;
  const fetchSummary = async() => {
    try{
         const res = await reviewService.getReviewSummary("event",eventId,);
     setSummary(res.data.data);
    }catch(err){
       console.log(err)
    }
   
  }

   const fetchReviews = async (pageNumber: number) => {
     try{
       const page= pageNumber;
          const res = await reviewService.getReviewsForOrganizer(eventId,"event",page,limit);
          console.log("res", res)
          setReviews(res.data.data.reviews);
          setTotalPages(res.data.data.total);
     }catch(err){{
        console.log(err);
     }}
    }
     useEffect(() => { 
       fetchSummary();
       fetchReviews(page);
     },[page]);

     return (
            <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Event Reviews</h1>

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
