"use client";

interface StarDistribution {
  [key: number]: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  starDistribution: StarDistribution;
}

export default function RatingSummary({
  averageRating,
  totalReviews,
  starDistribution,
}: RatingSummaryProps) {
  return (
    <div className="bg-white shadow rounded-lg p-5 border">
      <h2 className="text-xl font-semibold mb-3">Ratings Summary</h2>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-yellow-500">{averageRating?.toFixed(1)}</p>
          <p className="text-gray-500 text-sm">{totalReviews} Reviews</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star: number) => {
            const count = starDistribution[star];
            const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center mb-1">
                <span className="w-12 text-sm font-medium">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-sm">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
