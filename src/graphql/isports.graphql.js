import { gql } from '@apollo/client';

export const GET_CHANNEL_TOKEN = gql`
  query GET_CHANNEL_TOKEN($input: tokenRequest) {
    getItvChannelToken(input: $input) {
      token
    }
  }
`;

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
      number
      url
      censored
      hd
      is_favorite
      time
      time_to
      duration
      epgtitle
      epgdescription
      archived_link
    }
  }
`;

export const GET_CHANNELS = gql`
  query GET_CHANNELS($input: videoRequest) {
    isports(input: $input) {
      id
      number
      title
      description
      time
      time_to
      epgtitle
      epgdescription
      is_favorite
      archived_link
    }
  }
`;

export const GET_SPORTS_CHANNELS_BY_CATEGORIES = gql`
  query GET_SPORTS_CHANNELS_BY_CATEGORIES($input: videoRequestByGenre) {
    isportsByCategory(input: $input) {
      id
      number
      title
      description
      time
      time_to
      epgtitle
      epgdescription
      is_favorite
      archived_link
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
      number
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

export const GET_PROGRAMS_BY_CHANNEL = gql`
  query GET_PROGRAMS_BY_CHANNEL($input: channelRequestId) {
    getPrograms(input: $input) {
      id
      title
      time
      time_to
      duration
      description
    }
  }
`;

export const SEARCH = gql`
  query SEARCH_ISPORTS($input: videoRequest) {
    isports(input: $input) {
      id
      title
      description
      genre
      number
      url
      censored
      hd
      is_favorite
      time
      time_to
      duration
      epgtitle
      epgdescription
      archived_link
    }
  }
`;
