import { gql } from '@apollo/client';

export const GET_GENRES = gql`
  query GET_GENRES {
    iptvGenres {
      id
      title
    }
  }
`;

export const GET_CHANNELS = gql`
  query GET_CHANNELS($input: videoRequest) {
    iptvs(input: $input) {
      id
      title
      description
      genre
      numer
      url
      censored
      hd
      is_favorite
    }
  }
`;

export const GET_TV_CHANNELS_BY_CATEGORIES = gql`
  query GET_TV_CHANNELS_BY_CATEGORIES($input: videoRequestByGenre) {
    iptvByCategory(input: $input) {
      id
      title
      description
      numer
      genre
    }
  }
`;
