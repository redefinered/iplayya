import { IMOVIE_PAGINATOR_INFO_LIMIT } from 'common/globals';

export const setupImoviesCategoryPaginator = (categories) => {
  return categories.map(({ id, title }) => ({
    id,
    title,
    paginator: { pageNumber: 1, limit: IMOVIE_PAGINATOR_INFO_LIMIT, categories: [parseInt(id)] }
  }));
};
