export interface EventReview {
  id: string;
   targetType: ReviewType;
   rating: number;
   review: string;
   userId: string;
   createdAt: Date;
   userName?: string;
}

export   enum ReviewType {
  EVENT = "event",
  ORGANIZER = "organizer"
}
export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  starDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
export interface RatingSummaryType {
  averageRating: number;
  totalReviews: number;
  starDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}