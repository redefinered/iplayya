import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      title
    }
  }
`;

export const GET_MOVIES_BY_CATEGORIES = gql`
  query GET_MOVIES_BY_CATEGORIES($input: videoRequestByGenre) {
    videoByCategory(input: $input) {
      id
      title
      thumbnail
      category
      is_series
    }
  }
`;

export const GET_MOVIE = gql`
  query GET_MOVIE($input: videoRequestById) {
    video(input: $input) {
      id
      title
      description
      category
      director
      actors
      year
      time
      country
      age_rating
      rating_mpaa
      rating_imdb
      rating_kinopoisk
      is_hd
      is_censored
      is_favorite
      thumbnail
      cast
      is_series
      series {
        title
        season
        episodes {
          episode
          video_urls {
            quality
            link
          }
        }
      }
      video_urls {
        link
        quality
      }
    }
  }
`;

export const ADD_MOVIE_TO_FAVORITES = gql`
  mutation ADD_VIDEO_TO_FAVOURITES($input: videoToFavoritesInput) {
    addVideoToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const GET_FAVORITE_MOVIES = gql`
  query GET_FAVORITE_MOVIES($input: videoRequest) {
    favoriteVideos(input: $input) {
      id
      title
      year
      time
      age_rating
      rating_mpaa
      category
      thumbnail
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation REMOVE_FROM_FAVORITES($input: videoToFavoritesInput) {
    removeVideoToFavorites(input: $input) {
      status
      message
    }
  }
`;

export const GET_DOWNLOADS = gql`
  query GET_DOWNLOADS($input: videoRequestByIds) {
    videoByIds(input: $input) {
      id
      title
      year
      time
      age_rating
      rating_mpaa
      category
      thumbnail
    }
  }
`;

export const SEARCH = gql`
  query SEARCH_VIDEOS($input: videoRequest) {
    videos(input: $input) {
      id
      title
      is_series
      thumbnail
      category
    }
  }
`;
