import { reviewService } from "@/services/review/reviewService";
import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";
import { useState } from "react";

export default function ReviewForm ({eventId, refresh, userId, userName}:{eventId:string; refresh:() => void| Promise<void>; userId:string,userName:string}) {
  const[rating, setRating] = useState(0);
  const[review, setReview] = useState("");

  const handleSubmit = async () => {
    try{
        const targetType = "event"
    const res = await reviewService.addEventReview(eventId,{rating,review,userId,targetId: eventId, targetType, userName});
    console.log("res", res);
    showSuccess(res.data.message)
    refresh();
    }catch(err){
       if(err instanceof AxiosError){
           console.log("err", err)
         showError(err.response?.data.message);
       }
    }
    
  }

  return (
      <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Write a Review</h3>

      {/* Rating stars input */}
      <div className="flex gap-1 text-yellow-500 text-2xl cursor-pointer mb-2">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Share your experience..."
        className="w-full border p-2 rounded-lg"
      />

      <button
        onClick={handleSubmit}
        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Submit Review
      </button>
    </div>
  )
}