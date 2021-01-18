import { createSelector } from 'reselect';

export const moviesState = (state) => state.movies;

export const selectError = createSelector([moviesState], ({ error }) => error);

export const selectIsFetching = createSelector([moviesState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([moviesState], ({ movies }) => movies);
export const selectMovie = createSelector([moviesState], ({ movie }) => movie);

export const selectFeatured = createSelector([moviesState], ({ movies }) => {
  if (!movies.length) return;
  return movies[0]; // while waiting for API, select first item for now
});

export const selectPaginatorInfo = createSelector(
  [moviesState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectPlaybackInfo = createSelector([moviesState], ({ playbackInfo }) => playbackInfo);

export const selectSeekableDuration = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;
  if (typeof playbackInfo.seekableDuration === 'undefined') return 0;
  return Math.floor(playbackInfo.seekableDuration);
});

export const selectCurrentTime = createSelector([moviesState], ({ playbackInfo }) => {
  // console.log({ playbackInfo });
  if (!playbackInfo) return 0;
  if (typeof playbackInfo.currentTime === 'undefined') return 0;
  return Math.floor(playbackInfo.currentTime);
});

export const selectCategories = createSelector([moviesState], ({ categories }) => {
  return categories;
});

export const selectCategoriesOf = (type) =>
  createSelector([selectCategories], (categories) => {
    const collection = [];
    categories.map(({ id, title, category_alias }) => {
      if (type === category_alias) {
        return collection.push({ id, title });
      }
    });

    return collection;
  });

const selectMoviesForFilter = ({ movies: { movies } }, props) => {
  return movies.find(({ category }) => category === props.category);
};

export const selectMoviesByCategory = createSelector([selectMoviesForFilter], (movies) => movies);

const selectPaginatorInfoForFilter = ({ movies: { paginatorInfo } }, props) => {
  return paginatorInfo.find(({ title }) => title === props.category);
};

export const selectPaginatorOfCategory = createSelector(
  [selectPaginatorInfoForFilter],
  (paginatorInfo) => paginatorInfo
);
