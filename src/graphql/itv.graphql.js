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
    iptvGenres {
      id
      title
    }
  }
`;

export const GET_CHANNEL = gql`
  query GET_CHANNEL($input: videoRequestById) {
    iptv(input: $input) {
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
    iptvs(input: $input) {
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

export const GET_TV_CHANNELS_BY_CATEGORIES = gql`
  query GET_TV_CHANNELS_BY_CATEGORIES($input: videoRequestByGenre) {
    iptvByCategory(input: $input) {
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
  mutation ADD_TO_FAVORITES($input: addIptvToFavoritesInput) {
    addIptvToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const GET_FAVORITES = gql`
  query GET_FAVORITE_CHANNELS($input: videoRequest) {
    favoriteIptvs(input: $input) {
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
  mutation REMOVE_FROM_FAVORITES($input: addIptvToFavoritesInput) {
    removeIptvToFavorites(input: $input) {
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
  query SEARCH_ITV($input: videoRequest) {
    iptvs(input: $input) {
      id
      title
    }
  }
`;
