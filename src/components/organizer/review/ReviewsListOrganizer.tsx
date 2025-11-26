import { EventReview } from "@/types/user/review/reviewTypes";

export default function ReviewsListOrganizer({
   reviews}:{reviews: EventReview[]}
){
    return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-sm">No reviews yet</p>
      )}

      {reviews.map((r) => (
        <div key={r.id} className="border p-4 rounded-lg mb-3 bg-white shadow-sm">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-800">{r.userName}</p>
            <span className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-yellow-500 text-lg mt-1">
            {"★".repeat(r.rating)}{" "}
            <span className="text-gray-300">
              {"☆".repeat(5 - r.rating)}
            </span>
          </p>

          <p className="text-gray-700 mt-2">{r.review}</p>
        </div>
      ))}
    </div>
  );
}