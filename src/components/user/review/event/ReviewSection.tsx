// import { reviewService } from "@/services/review/reviewService";
// import { useEffect, useState, useCallback } from "react";
// import RatingStars from "./RatingStars";
// import ReviewForm from "./ReviewForm";
// import YourReviewCard from "./YourReviewCard";
// import ReviewsList from "./ReviewList";
// import { EventReview, RatingSummary } from "@/types/user/review/reviewTypes";

// interface Props {
//   mode: "event" | "organizer";
//   targetId: string;
//   userId: string;
//   userName: string;
// }

// export default function ReviewSection({ mode, targetId, userId, userName }: Props) {
//   const [summary, setSummary] = useState<RatingSummary | null>(null);
//   const [reviews, setReviews] = useState<EventReview[]>([]);
//   const [myReview, setMyReview] = useState<EventReview | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const limit = 5;

//   // ✅ Wrap fetchData with useCallback  
//   const fetchData = useCallback(async (pageNumber: number = 1) => {
//     setLoading(true);
//     try {
//       const summaryRes = await reviewService.getReviewSummary(mode, targetId);
//       const reviewRes = await reviewService.getEventReviews(targetId, mode, pageNumber, limit);

//       if (pageNumber === 1) {
//         setReviews(reviewRes.data.data.reviews);
//         setHasMore(reviewRes.data.data.hasMore);
//       } else {
//         setReviews(prev => [...prev, ...reviewRes.data.data.reviews]);
//         setHasMore(reviewRes.data.data.hasMore);
//       }

//       setSummary(summaryRes.data.data);
//       const mine = reviewRes.data.data.reviews.find((r: EventReview) => r.userId === userId);
//       setMyReview(mine || null);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [mode, targetId, userId]); // dependencies

//   const refreshReviews = async () => {
//   setPage(1);
//   await fetchData(1);
// };


//   const loadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchData(nextPage);
//   };
 



//   useEffect(() => {
//     fetchData(1);
//   }, [targetId, fetchData]);

//   // if (loading) return <p>Loading reviews...</p>;

//   return (
//     <>
//      {loading && (
//   <p className="text-sm text-gray-400 mb-2">
//     Updating reviews...
//   </p>
// )}

//     <div className="mt-8 bg-white p-5 rounded-xl shadow-sm">
//       <h2 className="text-xl font-semibold mb-4">
//         {mode === "event" ? "Event Reviews" : "Organizer Reviews"}
//       </h2>

//       <RatingStars summary={summary} />

//       {myReview ? (
//         <YourReviewCard review={myReview} refresh={refreshReviews} />
//       ) : (
//         <ReviewForm
//           targetId={targetId}
//           refresh={refreshReviews}
//           userId={userId}
//           userName={userName}
//           mode={mode}
//         />
//       )}

//       <ReviewsList
//         reviews={reviews}
//         hasMore={hasMore}
//         loadMore={loadMore}
//         loading={loading}
//       />
//     </div>
//     </>
//   );
// }





//--------new //import { reviewService } from "@/services/review/reviewService";
import { reviewService } from "@/services/review/reviewService";
import { useEffect, useState, useCallback } from "react";
import RatingStars from "./RatingStars";
import ReviewForm from "./ReviewForm";
import YourReviewCard from "./YourReviewCard";
import ReviewsList from "./ReviewList";
import { EventReview, RatingSummary } from "@/types/user/review/reviewTypes";
import { 
  Star, 
  MessageCircle, 
  Trophy, 
  PenTool, 
  Loader2,
  ShieldCheck
} from "lucide-react";


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

  const fetchData = useCallback(async (pageNumber: number = 1) => {
    setLoading(true);
    try {
      const summaryRes = await reviewService.getReviewSummary(mode, targetId);
      const reviewRes = await reviewService.getEventReviews(targetId, mode, pageNumber, limit);

      if (pageNumber === 1) {
        setReviews(reviewRes.data.data.reviews);
      } else {
        setReviews((prev) => [...prev, ...reviewRes.data.data.reviews]);
      }
      setHasMore(reviewRes.data.data.hasMore);
      setSummary(summaryRes.data.data);
      
      const mine = reviewRes.data.data.reviews.find((r: EventReview) => r.userId === userId);
      setMyReview(mine || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mode, targetId, userId]);

  useEffect(() => { fetchData(1); }, [targetId, fetchData]);

  const refreshReviews = () => { setPage(1); fetchData(1); };
  const loadMore = () => { const next = page + 1; setPage(next); fetchData(next); };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-100">
            {mode === "event" ? <Trophy size={28} /> : <ShieldCheck size={28} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === "event" ? "Event Feedback" : "Organizer Trust"}
            </h2>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <MessageCircle size={14} />
              <span>{reviews.length} Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Global Score Summary */}
        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Score</p>
            <div className="flex items-center gap-2">
               <RatingStars summary={summary} />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA (Single Column to prevent overlap) --- */}
      <div className="space-y-6">
        
        {/* Your Contribution Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden">
          {/* Decorative Background Icon */}
          <PenTool className="absolute -right-4 -top-4 text-slate-50 size-32 -rotate-12" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Star size={20} className="text-amber-400 fill-amber-400" />
              {myReview ? "Your Experience" : "Write your review"}
            </h3>
            
            {myReview ? (
              <YourReviewCard review={myReview} refresh={refreshReviews} />
            ) : (
              <ReviewForm targetId={targetId} refresh={refreshReviews} userId={userId} userName={userName} mode={mode} />
            )}
          </div>
        </div>

        {/* Community Feed Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-lg font-bold text-slate-700">Community Feed</h3>
            {loading && <Loader2 size={18} className="animate-spin text-indigo-500" />}
          </div>

          <div className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100">
            <ReviewsList
              reviews={reviews}
              hasMore={hasMore}
              loadMore={loadMore}
              loading={loading}
            />
          </div>
        </div>

      </div>
    </section>
  );
}