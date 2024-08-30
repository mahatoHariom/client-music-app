export interface Pagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  nextPage: number | null;
  pageLimit: number;
}
