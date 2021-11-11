import uniqBy from 'lodash/uniqBy';

const PAGINATOR_INFO_LIMIT = 20;

export const updateMoviesState = (state, newMovies) => {
  let { movies } = state;

  if (!newMovies.length) return movies;

  const index = movies.findIndex(({ category }) => category === newMovies[0].category);
  const moviesToUpdate = movies.find(({ category }) => category === newMovies[0].category);
  const mergedMovies = [...moviesToUpdate.videos, ...newMovies];

  // update movies
  movies.splice(index, 1, { category: movies[index].category, videos: uniqBy(mergedMovies, 'id') });

  return movies;
};

export const updatePaginatorInfo = (state, newMovies, nextPaginator) => {
  const { paginatorInfo } = state;

  if (!newMovies.length) return paginatorInfo;

  const prevPaginator = paginatorInfo.find(({ title }) => title === newMovies[0].category);
  const index = paginatorInfo.findIndex(({ title }) => title === newMovies[0].category);

  const paginator = Object.assign(prevPaginator, { paginator: nextPaginator });

  paginatorInfo.splice(index, 1, paginator);

  return paginatorInfo;
};

export const setupPaginator = (categories) => {
  return categories.map(({ id, title }) => ({
    id,
    title,
    paginator: { pageNumber: 1, limit: PAGINATOR_INFO_LIMIT, categories: [parseInt(id)] }
  }));
};
