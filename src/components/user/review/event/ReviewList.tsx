import { EventReview } from "@/types/user/review/reviewTypes";

export default function ReviewsList({reviews}:{reviews:EventReview[]}) {
 return(
    <div className="mt-6">
      <h3 className="font-semibold mb-3">All Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-gray-500">No reviews yet</p>
      )}

      {reviews.map((r: EventReview) => (
        <div key={r.id} className="border p-4 rounded-lg mb-3">
            {/* Reviewer Name */}
          <p className="font-semibold text-sm text-gray-700">
            {r.userName || "Unknown User"}
          </p>
          <div className="flex items-center gap-2">
            <div className="text-yellow-500 text-lg">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2">{r.review}</p>
        </div>
      ))}
    </div>
 )
}