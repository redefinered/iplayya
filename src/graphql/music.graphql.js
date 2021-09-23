import { gql } from '@apollo/client';

export const GET_GENRES = gql`
  {
    albumGenres {
      id
      name
    }
  }
`;

export const GET_ALBUMS_BY_GENRE = gql`
  query GET_ALBUMS_BY_GENRE($input: albumRequestByGenre) {
    albumByGenre(input: $input) {
      id
      name
      cover
      performer
      genre
    }
  }
`;

export const GET_ALBUM_DETAILS = gql`
  query GET_ALBUM_DETAILS($input: musicRequestByAlbumId) {
    album(input: $input) {
      id
      name
      cover
      performer
      year
      genre
      is_favorite
    }
  }
`;

export const GET_TRACKS_BY_ALBUM = gql`
  query GET_TRACKS_BY_ALBUM($input: musicRequestByAlbumId) {
    musicsByAlbum(input: $input) {
      id
      number
      name
      url
      album
      performer
      year
      duration
      is_favorite
    }
  }
`;

export const ADD_TRACK_TO_FAVORITES = gql`
  mutation ADD_TRACK_TO_FAVORITES($input: addImusicToFavoritesInput) {
    addImusicToFavorites(input: $input) {
      status
    }
  }
`;

export const ADD_ALBUM_TO_FAVORITES = gql`
  mutation ADD_ALBUM_TO_FAVORITES($input: addAlbumToFavoritesInput) {
    addAlbumToFavorites(input: $input) {
      status
    }
  }
`;
