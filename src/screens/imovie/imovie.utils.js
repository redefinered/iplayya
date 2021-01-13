export const setupPaginator = (categories) => {
  return categories.map(({ id, title }) => ({
    id,
    title,
    paginator: { pageNumber: 1, limit: 10, categories: [parseInt(id)] }
  }));
};
