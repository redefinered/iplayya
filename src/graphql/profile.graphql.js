import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GET_PROFILE {
    me {
      name
      email
      username
      first_name
      last_name
      phone
      birth_date
      gender
      providers {
        id
        name
        username
        created_at
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE(
    $id: ID!
    $name: String
    $username: String
    $first_name: String
    $last_name: String
    $email: String
    $phone: String
    $birth_date: String
    $gender: String
  ) {
    updateUserProfile(
      id: $id
      name: $name
      username: $username
      first_name: $first_name
      last_name: $last_name
      email: $email
      phone: $phone
      birth_date: $birth_date
      gender: $gender
    ) {
      id
    }
  }
`;
