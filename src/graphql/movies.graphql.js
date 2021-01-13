import { gql } from '@apollo/client';

export const GET_FEATURED_MOVIES = gql`
  query GET_FEATURED_MOVIES($input: videoRequest) {
    videos(input: $input) {
      id
      title
      thumbnail
    }
  }
`;

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
