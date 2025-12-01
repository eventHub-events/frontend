export interface PaginatedEventsResponse<T> {
  data:{
    data: {
    events: T[];
    totalPages: number;
  };
}
}
