import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    getFavorites: ['trackId'],
    getFavoritesSuccess: ['data', 'nextPaginator'],
    getFavoritesFailure: ['error'],

    addTrackToFavorites: ['data'],
    addTrackToFavoritesSuccess: null,
    addTrackToFavoritesFailure: ['error'],

    removeTrackFromFavorites: ['albumId'],
    removeTrackFromFavoritesSuccess: ['data'],
    removeTrackFromFavoritesFailure: ['error'],

    addAlbumToFavoritesStart: null,
    addAlbumToFavorites: ['albumId'],
    addAlbumToFavoritesSuccess: ['data'],
    addAlbumToFavoritesFailure: ['error'],

    removeAlbumFromFavorites: ['albumId'],
    removeAlbumFromFavoritesSuccess: ['data'],
    removeAlbumFromFavoritesFailure: ['error']
  },
  { prefix: '@ImusicFavorites/' }
);

export { Types, Creators };
