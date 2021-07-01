import { createSelector } from 'reselect';

export const musicState = (state) => state.music;

export const selectError = createSelector([musicState], ({ error }) => error);
export const selectIsFetching = createSelector([musicState], ({ isFetching }) => isFetching);
export const selectPlaylist = createSelector([musicState], ({ playlist }) => playlist);
export const selectNowPlaying = createSelector([musicState], ({ nowPlaying }) => nowPlaying);
export const selectPaused = createSelector([musicState], ({ paused }) => paused);
export const selectPlaybackInfo = createSelector([musicState], ({ playbackInfo }) => playbackInfo);
export const selectShuffle = createSelector([musicState], ({ shuffle }) => shuffle);
export const selectRepeat = createSelector([musicState], ({ repeat }) => repeat);
export const selectSeekValue = createSelector([musicState], ({ seekValue }) => seekValue);
export const selectAlbum = createSelector([musicState], ({ album }) => album);
export const selectGenres = createSelector([musicState], ({ genres }) => genres);

export const selectSearchResults = createSelector(
  [musicState],
  ({ searchResults }) => searchResults
);

export const selectPaginatorInfo = createSelector(
  [musicState],
  ({ paginatorInfo }) => paginatorInfo
);

export const selectGenrePaginator = createSelector(
  [musicState],
  ({ genrePaginator }) => genrePaginator
);

export const selectAlbums = createSelector([musicState], ({ albums }) => albums);

const selectAlbumsForFilter = ({ music: { albums } }, props) => {
  return albums.find(({ genre }) => genre === props.genre);
};

export const selectAlbumsByGenre = createSelector([selectAlbumsForFilter], (albums) => {
  if (typeof albums === 'undefined') return {};
  // console.log({ movies });
  return albums;
});

const selectPaginatorInfoForFilter = ({ music: { paginatorInfo } }, props) => {
  return paginatorInfo.find(({ title }) => title === props.genre);
};

export const selectPaginatorOfGenre = createSelector(
  [selectPaginatorInfoForFilter],
  (paginatorInfo) => paginatorInfo
);

export const selectTracks = createSelector([musicState], ({ album }) => {
  if (!album) return [];

  return album.tracks;
});

export const selectIsBackgroundMode = createSelector(
  [musicState],
  ({ isBackgroundMode }) => isBackgroundMode
);

export const selectNowPlayingLayoutInfo = createSelector(
  [musicState],
  ({ nowPlayingLayoutInfo }) => nowPlayingLayoutInfo
);

export const selectPlaybackProgress = createSelector(
  [musicState],
  ({ playbackProgress }) => playbackProgress
);
