import { createSelector } from 'reselect';

export const musicState = (state) => state.music;

export const selectError = createSelector([musicState], ({ error }) => error);

export const selectIsFetching = createSelector([musicState], ({ isFetching }) => isFetching);

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
