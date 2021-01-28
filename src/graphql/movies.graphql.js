import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      title
      category_alias
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
      rtsp_url
      is_favorite
      thumbnail
      cast
      is_favorite
    }
  }
`;

export const ADD_MOVIE_TO_FAVORITES = gql`
  mutation ADD_VIDEO_TO_FAVOURITES($input: addVideoToFavoritesInput) {
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
      rtsp_url
      year
      time
      age_rating
      rating_mpaa
      category
      thumbnail
    }
  }
`;
