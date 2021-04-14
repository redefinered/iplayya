import { createSelector } from 'reselect';

export const moviesState = (state) => state.movies;

export const selectError = createSelector([moviesState], ({ error }) => error);

export const selectIsFetching = createSelector([moviesState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([moviesState], ({ movies }) => movies);
export const selectMovie = createSelector([moviesState], ({ movie }) => movie);
export const selectMovieUrl = createSelector([moviesState], ({ movie }) => {
  if (!movie) return;
  const { is_series } = movie;

  if (is_series) {
    // const { series } = movie;
    // const { video_urls } = series;
    // const { link } = video_urls[0];
    // return link.split(' ')[1];
    return 'http://84.17.37.2/boxoffice/1080p/GodzillaVsKong-2021-1080p.mp4/index.m3u8';
  }
  const { link } = movie.video_urls[0];
  return link.split(' ')[1];
});

export const selectMovieTitle = createSelector([moviesState], ({ movie }) => {
  if (!movie) return;
  return movie.title;
});

export const selectFeatured = createSelector([moviesState], ({ movies }) => {
  if (!movies.length) return;
  return movies[0]; // while waiting for API, select first item for now
});

export const selectPaginatorInfo = createSelector(
  [moviesState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectPlaybackInfo = createSelector([moviesState], ({ playbackInfo }) => playbackInfo);

export const selectCategories = createSelector([moviesState], ({ categories }) => {
  return categories;
});

export const selectCategoriesOf = (type) =>
  createSelector([selectCategories], (categories) => {
    const collection = [];
    categories.map(({ id, title }) => {
      let category_alias = title.split(': ')[0];
      if (type === category_alias.toLowerCase()) {
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

export const selectFavorites = createSelector(
  [moviesState],
  ({ favoriteVideos }) => favoriteVideos
);

export const selectUpdatedFavoritesCheck = createSelector(
  [moviesState],
  ({ updatedFavorites }) => updatedFavorites
);

export const selectDownloads = createSelector([moviesState], ({ downloads }) => {
  // console.log({ downloadInfo });
  return downloads;
});

export const selectDownloadsData = createSelector(
  [moviesState],
  ({ downloadsData }) => downloadsData
);

export const selectDownloadsProgress = createSelector(
  [moviesState],
  ({ downloadsProgress }) => downloadsProgress
);

export const selectRemovedFromFavorites = createSelector(
  [moviesState],
  ({ removedFromFavorites }) => removedFromFavorites
);

export const selectSearchResults = createSelector(
  [moviesState],
  ({ searchResults }) => searchResults
);

export const selectSeekableDuration = createSelector([moviesState], ({ playbackInfo }) => {
  console.log({ playbackInfo });
  if (!playbackInfo) return 0;

  // if (typeof playbackInfo.seekableDuration === 'undefined') return 0;
  // return Math.floor(playbackInfo.seekableDuration);

  if (typeof playbackInfo.duration === 'undefined') return 0;
  return Math.floor(playbackInfo.duration);
});

export const selectCurrentTime = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  if (typeof playbackInfo.currentTime === 'undefined') return 0;
  return Math.floor(playbackInfo.currentTime / 1000);
});

export const selectCurrentPosition = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  if (typeof playbackInfo.position === 'undefined') return 0;
  return playbackInfo.position;
});

export const selectRemainingTime = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  if (typeof playbackInfo.remainingTime === 'undefined') return 0;
  return Math.abs(playbackInfo.remainingTime / 1000);
});
