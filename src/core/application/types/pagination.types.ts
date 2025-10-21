export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginationMetadata {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export function calculatePaginationMetadata(
  totalItems: number,
  currentPage: number,
  perPage: number
): PaginationMetadata {
  const totalPages = Math.ceil(totalItems / perPage);
  
  return {
    currentPage,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}