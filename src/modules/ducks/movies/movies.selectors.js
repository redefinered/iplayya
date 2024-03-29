import { createSelector } from 'reselect';

export const moviesState = (state) => state.movies;

export const selectError = createSelector([moviesState], ({ error }) => error);

export const selectIsFetching = createSelector([moviesState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([moviesState], ({ movies }) => movies);
export const selectMovie = createSelector([moviesState], ({ movie }) => movie);

export const selectDownloadUrl = createSelector([moviesState], ({ movie, currentEpisode }) => {
  if (!movie) return;

  let { video_urls } = movie;

  // console.log('currentEpisode', currentEpisode);

  if (currentEpisode) {
    // is_series should be true at this point
    const { season, episode } = currentEpisode;
    const { series } = movie;
    const { episodes } = series.find(({ season: s }) => parseInt(s) === season);
    video_urls = episodes.find(({ episode: e }) => parseInt(e) === episode).video_urls;
  }

  if (!video_urls) return '';

  const urls = video_urls.map(({ link }) => link);
  const mp4url = urls.find((url) => !url.includes('video.m3u8'));

  if (typeof mp4url === 'undefined') return '';

  return mp4url.split(' ')[1];
});

/**
 * for initial video source
 * get the first m3u8 source
 * if no m3u8 found get the first mp4 source
 */
export const selectUrlForVodPlayer = createSelector([moviesState], ({ movie }) => {
  if (!movie) return;

  const { video_urls } = movie;

  if (!video_urls) return '';

  const urls = movie.video_urls.map(({ link }) => link);
  const mp4url = urls.find((url) => !url.includes('video.m3u8'));
  const m3u8url = urls.find((url) => url.includes('m3u8'));

  // return an empty string if
  if (typeof mp4url === 'undefined' && typeof m3u8url === 'undefined') return '';

  if (typeof m3u8url === 'undefined') return mp4url.split(' ')[1];

  return m3u8url.split(' ')[1];
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

export const selectMoviesByCategory = createSelector([selectMoviesForFilter], (movies) => {
  if (typeof movies === 'undefined') return {};
  // console.log({ movies });
  return movies;
});

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

// export const selectDownloads = createSelector([moviesState], ({ downloads }) => {
//   return downloads;
// });

// export const selectDownloadsData = createSelector(
//   [moviesState],
//   ({ downloadsData }) => downloadsData
// );

// export const selectDownloadsProgress = createSelector(
//   [moviesState],
//   ({ downloadsProgress }) => downloadsProgress
// );

export const selectRemovedFromFavorites = createSelector(
  [moviesState],
  ({ removedFromFavorites }) => removedFromFavorites
);

export const selectSearchResults = createSelector(
  [moviesState],
  ({ searchResults }) => searchResults
);

export const selectRecentSearch = createSelector([moviesState], ({ recentSearch }) => recentSearch);

export const selectSimilarMovies = createSelector(
  [moviesState],
  ({ similarMovies }) => similarMovies
);

export const selectSeekableDuration = createSelector([moviesState], ({ playbackInfo }) => {
  console.log({ playbackInfo });
  if (!playbackInfo) return 0;

  // if (typeof playbackInfo.seekableDuration === 'undefined') return 0;
  // return Math.floor(playbackInfo.seekableDuration);

  if (typeof playbackInfo.duration === 'undefined') return 0;
  return Math.floor(playbackInfo.duration);
});

// export const selectCurrentPosition = createSelector([moviesState], ({ playbackInfo }) => {
//   if (!playbackInfo) return 0;

//   if (typeof playbackInfo.position === 'undefined') return 0;
//   return playbackInfo.position;
// });

export const selectCurrentTime = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  if (typeof playbackInfo.currentTime === 'undefined') return 0;
  // return Math.floor(playbackInfo.currentTime / 1000);
  return playbackInfo.currentTime;
});

export const selectRemainingTime = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  const { seekableDuration, currentTime } = playbackInfo;
  const remainingTime = seekableDuration - currentTime;

  // const { duration, currentTime } = playbackInfo;
  // const remainingTime = duration - currentTime;

  // return Math.abs(remainingTime / 1000);
  return remainingTime;
});

export const selectDuration = createSelector([moviesState], ({ playbackInfo }) => {
  if (!playbackInfo) return 0;

  const { seekableDuration } = playbackInfo;

  if (typeof seekableDuration === 'undefined') return 0;

  return seekableDuration;
});

export const selectCategoryPaginator = createSelector(
  [moviesState],
  ({ categoryPaginator }) => categoryPaginator
);

export const selectMovieVideoUrls = createSelector([moviesState], ({ movie }) => {
  if (!movie) return [];

  if (!movie.video_urls) return [];

  return movie.video_urls;
});

export const selectCurrentEpisode = createSelector(
  [moviesState],
  ({ currentEpisode }) => currentEpisode
);
