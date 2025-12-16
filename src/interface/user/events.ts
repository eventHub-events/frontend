export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  location: string;

}
export interface EventFilterParams {
  title?: string;
  location?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface SearchEventsParams {
    search? : string;
    page?: number;
    limit?: number;
}
