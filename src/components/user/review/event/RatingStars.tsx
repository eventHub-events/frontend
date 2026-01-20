import { Star, TrendingUp } from "lucide-react";

interface RatingSummary {
  averageRating?: number;
}

interface RatingStarsProps {
  summary: RatingSummary | null;
}

export default function RatingStars({ summary }: RatingStarsProps) {
  const average = summary?.averageRating ?? 0;
  const roundedAverage = Math.round(average);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-5">
        {/* Modern Large Score Display */}
        <div className="relative group">
          <div className="text-5xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
            {average.toFixed(1)}
          </div>
          {/* Decorative accent line */}
          <div className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-gradient-to-r from-gray-500 via-gray-800 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex flex-col justify-center gap-1">
          {/* Enhanced Visual Star Row */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                strokeWidth={2.5}
                fill={star <= roundedAverage ? "url(#starGradient)" : "transparent"}
                className={`${
                  star <= roundedAverage 
                    ? "filter drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" 
                    : "text-slate-200"
                } transition-all duration-500`}
                style={{ 
                   color: star <= roundedAverage ? '#FBBF24' : '#E2E8F0'
                }}
              />
            ))}
            {/* SVG Gradient Definition for Stars */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Premium Status Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
            <TrendingUp size={12} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-700/80">
              {average >= 4.5 ? "Exceptional" : average >= 3.5 ? "Top Rated" : average > 0 ? "Highly Reviewed" : "Waiting for Ratings"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Depth Progress Bar */}
      <div className="mt-5 w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[2px] shadow-inner">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all duration-1000 ease-out"
          style={{ width: `${(average / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}