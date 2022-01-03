export const setupPaginator = (categories) => {
  return categories.map(({ id, title }) => ({
    id,
    title,
    paginator: { pageNumber: 1, limit: 10, categories: [parseInt(id)] }
  }));
};

export const isMovieDownloaded = (movie, downloads) => {
  if (!downloads) return;

  const dl = downloads.find((d) => d === movie.dlfname);

  return dl ? true : false;
};
