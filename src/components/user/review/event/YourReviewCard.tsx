import { reviewService } from "@/services/review/reviewService";
import { EventReview } from "@/types/user/review/reviewTypes";
import { showError, showSuccess } from "@/utils/toastService";
import { useState } from "react";


export  default function YourReviewCard({review, refresh}:{review:EventReview; refresh:() => void| Promise<void>}) {
  const[editing, setEditing] = useState(false);
  const[newText, setNewText] = useState(review.review);
  const[newRating, setNewRating] = useState(review.rating);

  const handleUpdate = async () => {
    try{
        if(newRating<1) showError("Rating can't be empty")
       await reviewService.updateReview(review.id,{rating: newRating, review: newText});
       setEditing(false);
       showSuccess("Review updated successfully")
      await  refresh();

    }catch(err){
       console.log(err);
    };

  }
    const handleDelete  = async () => {
      try{
         await reviewService.deleteReview(review.id);
        await refresh();
      }catch(err){
         console.log(err)
      }
     
    };
     return (
       <div className="border p-4 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Your Review</h3>

      {editing ? (
        <>
          {/* Edit stars */}
          <div className="flex gap-1 text-yellow-500 text-2xl cursor-pointer mb-2">
            {[1,2,3,4,5].map((star) => (
              <span
                key={star}
                onClick={() => setNewRating(star)}
                className={star <= newRating ? "text-yellow-500" : "text-gray-300"}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className="w-full border p-2 rounded-lg"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />

          <button
            onClick={handleUpdate}
            className="mt-2 bg-green-600 text-white px-3 py-2 rounded-lg mr-2"
          >
            Save
          </button>

          <button
            onClick={() => setEditing(false)}
            className="mt-2 bg-gray-400 text-white px-3 py-2 rounded-lg"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="text-yellow-500 text-xl">
            {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </div>

          <p className="mt-1 text-gray-700">{review.review}</p>

          <button
            onClick={() => setEditing(true)}
            className="text-blue-600 text-sm mt-3 mr-4"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="text-red-600 text-sm mt-3"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}