export default function RatingStars({summary}: {summary:any}) {
  return (
        <div className="flex items-center gap-2 mb-4">
      <div className="text-3xl font-bold">{summary.averageRating.toFixed(1)}</div>
      <div className="text-yellow-500 text-xl">
        {"★".repeat(Math.round(summary.averageRating))}
        {"☆".repeat(5 - Math.round(summary.averageRating))}
      </div>
      <span className="text-gray-500 text-sm">{summary.totalReviews} reviews</span>
    </div>
  )
}