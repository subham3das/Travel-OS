import { PaginationMeta } from './response.util.js';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class PaginationUtil {
  public static readonly DEFAULT_PAGE = 1;
  public static readonly DEFAULT_LIMIT = 10;
  public static readonly MAX_LIMIT = 100;

  public static normalize(params: PaginationParams): { page: number; limit: number; skip: number } {
    const rawPage = Number(params.page);
    const rawLimit = Number(params.limit);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : this.DEFAULT_PAGE;
    const limit =
      !isNaN(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, this.MAX_LIMIT) : this.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  public static buildMeta(totalRecords: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    return {
      page,
      limit,
      totalPages,
      totalRecords,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}
