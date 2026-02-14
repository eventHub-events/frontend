import { organizerReviewService } from "@/services/organizer/review/organizerReviewService";
import { reviewService } from "@/services/review/reviewService";
import { showError, showSuccess } from "@/utils/toastService";
import { AxiosError } from "axios";
import { useState } from "react";
import { Star, Send, MessageSquarePlus, Sparkles, Loader2 } from "lucide-react";

interface Props {
  mode: "event" | "organizer";
  targetId: string;
  userId: string;
  userName: string;
  refresh: () => void | Promise<void>;
}

export default function ReviewForm({ targetId, refresh, userId, userName, mode }: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      if (rating < 1) {
        showError("Rating is required");
        return;
      }
      if (!review.trim()) {
  showError("Review cannot be empty");
  return;
}

if (review.trim().length < 10) {
  showError("Review must be at least 10 characters");
  return;
}

if (review.length > 500) {
  showError("Review cannot exceed 500 characters");
  return;
}
if (!/^[A-Za-z]/.test(review.trim())) {
  showError("Review must start with a letter");
  return;
}
if (!/[a-zA-Z0-9]/.test(review)) {
  showError("Please write a meaningful review");
  return;
}
      setIsSubmitting(true);
      
      const payload = { rating, review, userId, targetId, targetType: mode, userName };
      
      let res;
      if (mode === "event") {
        res = await reviewService.addEventReview(targetId, payload);
      } else {
        res = await organizerReviewService.addOrganizerReview(targetId, payload);
      }

      showSuccess(res.data.message);
      setReview("");
      setRating(0);
      refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        showError(err.response?.data.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-1 shadow-2xl shadow-purple-100/50 transition-all duration-300 hover:shadow-purple-200/60">
      {/* Decorative Gradient Flare */}
      <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-purple-100/40 blur-2xl" />
      
      <div className="relative rounded-[2.3rem] border border-slate-50 bg-white px-6 py-8 sm:px-8">
        {/* Header Area */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-purple-200">
            <MessageSquarePlus size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-800">Rate your experience</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Share your story</p>
          </div>
        </div>

        {/* Interactive Rating Stars */}
        <div className="mb-8 flex flex-col items-center justify-center rounded-3xl bg-slate-50/50 py-6 border border-slate-100/50">
          <p className="mb-3 text-xs font-black uppercase tracking-tighter text-slate-400">Tap to rate</p>
          <div className="flex gap-2 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 hover:scale-110"
              >
                <Star
                  size={36}
                  fill={(hoveredRating || rating) >= star ? "#FBBF24" : "transparent"}
                  className={`transition-colors duration-200 ${
                    (hoveredRating || rating) >= star 
                      ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                      : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-amber-600 animate-in fade-in zoom-in">
              <Sparkles size={12} />
              {rating === 5 ? "EXCELLENT!" : rating >= 3 ? "GOOD" : "COULD BE BETTER"}
            </div>
          )}
        </div>

        {/* Review Textarea */}
        <div className="group relative">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell the community about your experience..."
            className="w-full rounded-[1.8rem] border-2 border-slate-50 bg-slate-50 p-5 text-slate-700 outline-none transition-all focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50/50"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group mt-6 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-red-600 via-red-600 to-red-700 py-4 font-black tracking-wide text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] hover:shadow-indigo-200 active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="text-sm uppercase">Submit Review</span>
              <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}