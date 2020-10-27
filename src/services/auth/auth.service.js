import { gql } from '@apollo/client';
import client, { clientWithoutAuthLink } from 'apollo/client';

export const hello = (name) => {
  return { name };
};

export const signIn = async (username, password) => {
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: gql`
        mutation LOGIN($input: LoginInput!) {
          login(input: $input) {
            access_token
          }
        }
      `,
      variables: { input: { username, password } }
    });
    console.log({ data });
    return data;
  } catch ({ graphQLErrors }) {
    throw new Error(graphQLErrors[0].extensions.reason);
  }
};

export const getProfile = async () => {
  try {
    const { data } = await client.query({
      query: gql`
        {
          me {
            name
            email
          }
        }
      `
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
