import { reviewService } from "@/services/review/reviewService";
import { useEffect, useState } from "react";
import RatingStars from "./RatingStars";
import ReviewForm from "./ReviewForm";
import YourReviewCard from "./YourReviewCard";
import ReviewsList from "./ReviewList";
import { EventReview, RatingSummary } from "@/types/user/review/reviewTypes";

export default function ReviewSection({eventId, userId, userName}:{eventId: string; userId: string, userName:string}) {
 const[summary, setSummary] = useState<RatingSummary | null>(null);
 const[reviews,setReviews] =  useState<EventReview[]>([]);
 const[myReview, setMyReview] = useState<EventReview | null>(null);
 const[loading, setLoading] = useState(true);
 

 const fetchData = async () => {
  setLoading(true);
  try{
    const summaryRes = await reviewService.getReviewSummary("event",eventId);
    const reviewRes = await reviewService.getEventReviews(eventId,"event");
     setSummary(summaryRes.data.data);
     setReviews(reviewRes.data.data);
       console.log("hello",summaryRes)
     const mine = reviewRes.data.data.find((r: any) => r.userId === userId);
     setMyReview(mine || null);
     setLoading(false);

  }catch(err){
     console.log(err);
  }

 }

 useEffect(() => {
   fetchData();

 },[eventId]);


   if (loading) return <p>Loading reviews...</p>;

  return (
       <div className="mt-8 bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Reviews & Ratings</h2>

      {/* ⭐ Rating Summary */}
      <RatingStars summary={summary} />

      {myReview ? (
        <YourReviewCard
          review={myReview}
          refresh={fetchData}
        />
      ) : (
        <ReviewForm eventId={eventId} refresh={fetchData} userId ={userId} userName = {userName} />
      )}

      {/* List of all reviews */}
      <ReviewsList reviews={reviews} />
    </div>
  )

}