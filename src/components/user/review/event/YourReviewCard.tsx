import { reviewService } from "@/services/review/reviewService";
import { EventReview } from "@/types/user/review/reviewTypes";
import { showError, showSuccess } from "@/utils/toastService";
import { useState } from "react";
import { Pencil, Trash2, Save, X, MessageSquare, Star, CheckCircle2 } from "lucide-react";

export default function YourReviewCard({
  review,
  refresh,
}: {
  review: EventReview;
  refresh: () => void | Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(review.review);
  const [newRating, setNewRating] = useState(review.rating);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async () => {
    try {
      if (newRating < 1) return showError("Rating can't be empty");
      await reviewService.updateReview(review.id, {
        rating: newRating,
        review: newText,
      });
      setEditing(false);
      showSuccess("Review updated successfully");
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      setIsDeleting(true);
      await reviewService.deleteReview(review.id);
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-1 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-100 ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      {/* Decorative Gradient Blob */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-100/50 blur-3xl transition-all group-hover:bg-indigo-200/50" />
      
      <div className="relative rounded-[1.8rem] bg-white p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-gray-900">Your Experience</h3>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Personal Review</p>
            </div>
          </div>

          {!editing && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                title="Edit Review"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={handleDelete}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                title="Delete Review"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        {editing ? (
          <div className="space-y-4">
            {/* Interactive Stars */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">Update Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className={`group/star transition-all duration-200 ${
                      star <= newRating ? "scale-110" : "scale-100 opacity-40 grayscale"
                    }`}
                  >
                    <Star 
                      size={28} 
                      fill={star <= newRating ? "#FBBF24" : "transparent"} 
                      className={star <= newRating ? "text-amber-400" : "text-gray-400"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 p-4 text-gray-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={4}
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdate}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
              >
                <Save size={18} />
                Save Changes
              </button>

              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 rounded-2xl bg-gray-100 px-6 py-3 font-semibold text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Display Stars */}
            <div className="mb-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill={star <= review.rating ? "#FBBF24" : "transparent"}
                  className={star <= review.rating ? "text-amber-400" : "text-gray-200"}
                />
              ))}
              <span className="ml-2 text-sm font-bold text-amber-600">{review.rating}.0</span>
            </div>

            {/* Review text */}
            <div className="relative">
              <span className="absolute -left-2 -top-2 text-4xl text-indigo-100/50 italic"></span>
              <p className="relative z-10 text-lg leading-relaxed text-gray-600">
                {review.review}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-gray-50 pt-4">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs font-medium text-gray-400">Verified Reviewer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}