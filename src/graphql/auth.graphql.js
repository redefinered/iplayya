import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation SIGN_UP($input: RegisterInput) {
    register(input: $input) {
      tokens {
        access_token
      }
      status
    }
  }
`;

export const SIGN_IN = gql`
  mutation LOGIN($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
      }
    }
  }
`;

export const SIGN_OUT = gql`
  mutation {
    logout {
      status
      message
    }
  }
`;

export const VALIDATE_USERNAME = gql`
  mutation VALIDATE_USERNAME($input: validateUsernameInput) {
    validateUsername(input: $input) {
      status
      message
    }
  }
`;
