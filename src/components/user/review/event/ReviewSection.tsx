import { reviewService } from "@/services/review/reviewService";
import { useEffect, useState, useCallback } from "react";
import RatingStars from "./RatingStars";
import ReviewForm from "./ReviewForm";
import YourReviewCard from "./YourReviewCard";
import ReviewsList from "./ReviewList";
import { EventReview, RatingSummary } from "@/types/user/review/reviewTypes";

interface Props {
  mode: "event" | "organizer";
  targetId: string;
  userId: string;
  userName: string;
}

export default function ReviewSection({ mode, targetId, userId, userName }: Props) {
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [myReview, setMyReview] = useState<EventReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  // ✅ Wrap fetchData with useCallback  
  const fetchData = useCallback(async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const summaryRes = await reviewService.getReviewSummary(mode, targetId);
      const reviewRes = await reviewService.getEventReviews(targetId, mode, pageNumber, limit);

      if (pageNumber === 1) {
        setReviews(reviewRes.data.data.reviews);
        setHasMore(reviewRes.data.data.hasMore);
      } else {
        setReviews(prev => [...prev, ...reviewRes.data.data.reviews]);
        setHasMore(reviewRes.data.data.hasMore);
      }

      setSummary(summaryRes.data.data);
      const mine = reviewRes.data.data.reviews.find((r: EventReview) => r.userId === userId);
      setMyReview(mine || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [mode, targetId, userId]); // dependencies

  const refreshReviews = async () => {
  setPage(1);
  await fetchData(1);
};


  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };
 



  useEffect(() => {
    fetchData(1);
  }, [targetId, fetchData]);

  // if (loading) return <p>Loading reviews...</p>;

  return (
    <>
     {loading && (
  <p className="text-sm text-gray-400 mb-2">
    Updating reviews...
  </p>
)}

    <div className="mt-8 bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "event" ? "Event Reviews" : "Organizer Reviews"}
      </h2>

      <RatingStars summary={summary} />

      {myReview ? (
        <YourReviewCard review={myReview} refresh={refreshReviews} />
      ) : (
        <ReviewForm
          targetId={targetId}
          refresh={refreshReviews}
          userId={userId}
          userName={userName}
          mode={mode}
        />
      )}

      <ReviewsList
        reviews={reviews}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={loading}
      />
    </div>
    </>
  );
}
