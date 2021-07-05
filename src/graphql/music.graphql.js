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
      year
      genre
    }
  }
`;

export const GET_ALBUM = gql`
  query GET_ALBUM($input: musicRequestByAlbumId) {
    musicsByAlbum(input: $input) {
      id
      number
      name
      url
      album
      performer
      year
      duration
    }
  }
`;

export const SEARCH = gql`
  query SEARCH_ALBUMS($input: musicRequest) {
    albums(input: $input) {
      id
      name
    }
  }
`;

export const ADD_ALBUM_TO_FAVORITES = gql`
  mutation ADD_ALBUM_TO_FAVORITES($input: addAlbumToFavoritesInput) {
    addAlbumToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const REMOVE_ALBUM_FORM_FAVORITES = gql`
  mutation REMOVE_ALBUM_FORM_FAVORITES($input: addAlbumToFavoritesInput) {
    removeAlbumToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const ADD_TRACK_TO_FAVORITES = gql`
  mutation ADD_TRACK_TO_FAVORITES($input: addImusicToFavoritesInput) {
    addImusicToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const REMOVE_TRACK_FROM_FAVORITES = gql`
  mutation REMOVE_TRACK_FROM_FAVORITES($input: addImusicToFavoritesInput) {
    removeImusicToFavorites(input: $input) {
      status
      message
    }
  }
`;
