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
    }
  }
`;
