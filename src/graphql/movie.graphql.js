import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
  query GET_MOVIES($input: videoRequest) {
    videos(input: $input) {
      id
      title
      thumbnail
    }
  }
`;
