import { EventReview } from "@/types/user/review/reviewTypes";
import { 
  Star, 
  Calendar, 
  User2, 
  Quote, 
  ArrowDownCircle, 
  Loader2, 
  Heart,
  MessageCircle
} from "lucide-react";

interface ReviewsListProps {
  reviews: EventReview[];
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
}

export default function ReviewsList({ reviews, hasMore, loadMore, loading }: ReviewsListProps) {
  return (
    <div className="w-full space-y-8">
      {/* --- Section Header --- */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200">
            <MessageCircle size={22} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Member Stories
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {reviews.length} Total
        </div>
      </div>

      {/* --- Empty State --- */}
      {reviews.length === 0 && !loading && (
        <div className="text-center py-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
            <Quote size={32} />
          </div>
          <p className="text-slate-500 font-semibold text-lg">Be the first to share your experience!</p>
        </div>
      )}

      {/* --- Reviews Feed --- */}
      <div className="grid gap-6">
        {reviews.map((r: EventReview) => (
          <div 
            key={r.id} 
            className="relative group bg-white p-6 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-50 transition-all duration-500 hover:shadow-purple-100 hover:-translate-y-1"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-6 right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Quote size={80} />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-inner">
                      <User2 size={28} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Heart size={12} className="text-pink-500 fill-pink-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                      {r.userName || "Guest Explorer"}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-slate-400 font-bold text-xs">
                      <Calendar size={12} className="text-indigo-400" />
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Rating Visual */}
                <div className="flex items-center gap-1 bg-slate-900 px-4 py-2 rounded-2xl shadow-lg shadow-slate-200">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-black text-sm">{r.rating}.0</span>
                </div>
              </div>

              {/* Review Content */}
              <div className="mt-6">
                <p className="text-slate-600 leading-relaxed text-base font-medium">
                  {r.review}
                </p>
              </div>

              {/* Tag/Badges */}
              <div className="mt-6 pt-5 border-t border-slate-50 flex gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-500 rounded-lg uppercase tracking-tighter">
                  #VerifiedExperience
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-500 rounded-lg uppercase tracking-tighter">
                  {r.rating >= 4 ? "Highly Recommended" : "Community Feedback"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Load More Button --- */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 rounded-[2rem] bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin text-indigo-300" />
                <span>Opening more stories...</span>
              </>
            ) : (
              <>
                <ArrowDownCircle size={20} />
                <span>Show more reviews</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}