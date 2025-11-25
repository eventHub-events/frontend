import { EventReview } from "@/types/user/review/reviewTypes";

interface ReviewsListProps {
  reviews: EventReview[];
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean; // <-- you MUST receive this
}

export default function ReviewsList({ reviews, hasMore, loadMore, loading }: ReviewsListProps) {
  return (
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

      {/* Load More Button SHOULD BE OUTSIDE THE MAP */}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium"
        >
          {loading ? "Loading..." : "Load more reviews"}
        </button>
      )}
    </div>
  );
}
