import { gql } from '@apollo/client';

export const GET_GENRES = gql`
  query GET_GENRES {
    isportsGenres {
      id
      title
    }
  }
`;

export const GET_CHANNEL = gql`
  query GET_CHANNEL($input: videoRequestById) {
    isport(input: $input) {
      id
      title
      description
      genre
      numer
      url
      censored
      hd
      is_favorite
      time
      time_to
      duration
      epgtitle
      epgdescription
    }
  }
`;

export const GET_CHANNELS = gql`
  query GET_CHANNELS($input: videoRequest) {
    isports(input: $input) {
      id
      title
      description
      time
      time_to
      epgtitle
      epgdescription
      is_favorite
    }
  }
`;

export const GET_SPORTS_CHANNELS_BY_CATEGORIES = gql`
  query GET_SPORTS_CHANNELS_BY_CATEGORIES($input: videoRequestByGenre) {
    isportsByCategory(input: $input) {
      id
      title
      description
      number
      genre
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
  mutation ADD_TO_FAVORITES($input: addIsportToFavoritesInput) {
    addIsportToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const GET_FAVORITES = gql`
  query GET_FAVORITE_CHANNELS($input: videoRequest) {
    favoriteIsports(input: $input) {
      id
      title
      description
      time
      time_to
      epgtitle
      epgdescription
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation REMOVE_FROM_FAVORITES($input: addIsportToFavoritesInput) {
    removeIsportToFavorites(input: $input) {
      status
      message
    }
  }
`;
