import { gql } from '@apollo/client';
import client, { clientWithoutAuthLink } from 'apollo/client';

// wip
// export const processError = (error, graphQLErrors) => {
//   console.log({ error });
//   const { validation, reason } = graphQLErrors[0].extensions;
//   if (validation) return ''
//   if (reason) return error.message;
//   if (graphQLErrors.length) return graphQLErrors[0].extensions.reason;
//   return error.message;
// };

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
    // const message = processError(error, error.graphQLErrors);
    // throw new Error(message);
    console.log({ error });
    if (error.message === 'Authentication exception') {
      throw new Error(error.graphQLErrors[0].extensions.reason);
    }
    throw new Error(error);
  }
};

export const register = async (form) => {
  const { ...input } = form;
  console.log({ input });
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: gql`
        mutation SIGN_UP($input: RegisterInput) {
          register(input: $input) {
            tokens {
              access_token
            }
            status
          }
        }
      `,
      variables: { input: { ...input } }
    });
    return data;
  } catch ({ graphQLErrors }) {
    // console.log({ error });
    // throw new Error(error);

    const {
      extensions: { validation }
    } = graphQLErrors[0];
    if (validation['input.password']) throw new Error(validation['input.password']);
    throw new Error(validation['input.email']);
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
    throw new Error(error);
  }
};
