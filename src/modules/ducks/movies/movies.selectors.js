import { createSelector } from 'reselect';

export const moviesState = (state) => state.movies;

export const selectError = createSelector([moviesState], ({ error }) => error);

export const selectIsFetching = createSelector([moviesState], ({ isFetching }) => isFetching);

export const selectMovies = createSelector([moviesState], ({ movies }) => movies);
export const selectMovie = createSelector([moviesState], ({ movie }) => movie);
export const selectMovieUrl = createSelector([moviesState], ({ movie }) => {
  if (!movie) return;
  return movie.rtsp_url.split(' ')[1];
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

// export const selectIsDownloaded = createSelector([moviesState], async ({ movie }) => {
//   if (!movie) return null;
//   const dirs = RNFetchBlob.fs.dirs;
//   const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;

//   const titlesplit = movie.title.split(' ');
//   const title = titlesplit.join('_');
//   const filename = `${movie.id}_${title}.mp4`;

//   const ls = await RNFetchBlob.fs.ls(dir);

//   const isDownloaded = ls.find((file) => filename === file);

//   const t = typeof isDownloaded === 'undefined' ? false : true;
//   return t;
// });