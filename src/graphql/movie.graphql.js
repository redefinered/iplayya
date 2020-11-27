import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
  query GET_VIDEOS($input: videoRequest) {
    videos(input: $input) {
      id
      title
      description
    }
  }
`;
