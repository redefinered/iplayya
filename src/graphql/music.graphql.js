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
