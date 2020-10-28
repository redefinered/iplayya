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
  } catch (error) {
    const { graphQLErrors } = error;
    console.log({ signInError: error });
    if (graphQLErrors.length) throw new Error(graphQLErrors[0].extensions.reason);
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation {
          logout {
            status
            message
          }
        }
      `
    });
    console.log({ logoutData: data });
    return data;
  } catch (error) {
    const { graphQLErrors } = error;
    console.log({ logoutError: error });
    if (graphQLErrors.length) throw new Error(graphQLErrors[0].extensions.reason);
    throw new Error(error);
  }
};
