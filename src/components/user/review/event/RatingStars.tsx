
interface RatingSummary {
  averageRating?: number;
}

interface RatingStarsProps {
  summary: RatingSummary | null;
}

export default function RatingStars({ summary }: RatingStarsProps) {
  if (!summary) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <div className="text-3xl font-bold">0.0</div>
        <div className="text-yellow-500 text-xl">☆☆☆☆☆</div>
      </div>
    );
  }

  const average = summary.averageRating ?? 0;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-3xl font-bold">{average.toFixed(1)}</div>

      <div className="text-yellow-500 text-xl">
        {"★".repeat(Math.round(average))}
        {"☆".repeat(5 - Math.round(average))}
      </div>
    </div>
  );
}
