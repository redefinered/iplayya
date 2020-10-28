import { gql } from '@apollo/client';
import { clientWithoutAuthLink } from 'apollo/client';

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
