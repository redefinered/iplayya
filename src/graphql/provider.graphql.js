import { gql } from '@apollo/client';

export const CREATE_PROVIDER = gql`
  mutation CREATE_PROVIDER($input: createUserProviderInput!) {
    createUserProvider(input: $input) {
      id
    }
  }
`;

export const DELETE_PROVIDER = gql`
  mutation DELETE_PROVIDER($id: ID!) {
    deleteUserProvider(id: $id) {
      id
    }
  }
`;
