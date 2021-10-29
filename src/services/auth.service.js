import client, { clientWithoutAuthLink } from 'apollo/client';
import { REGISTER, SIGN_IN, SIGN_OUT, VALIDATE_USERNAME } from 'graphql/auth.graphql';

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
      mutation: SIGN_IN,
      variables: { input: { username, password } }
    });

    return data;
  } catch (error) {
    console.log({ errorx: error });
    // const message = processError(error, error.graphQLErrors);
    // throw new Error(message);

    if (error.message === 'Authentication exception') {
      // throw new Error(error.graphQLErrors[0].extensions.reason);
      throw new Error('Your email or password is incorrect.');
    }
    throw new Error(error);
  }
};

export const register = async (form) => {
  const { ...input } = form;
  console.log({ input });
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: REGISTER,
      variables: { input }
    });
    return data;
  } catch (error) {
    /**
     * ERROR MESSAGES SHOULD BE AS FOLLOW:
     * USERNAME: USERNAME_ERROR
     * EMAIL: EMAIL_ERROR
     * ***
     * NO NEED TO GET THE WHOLE ERROR MESSAGE AS INPUTS ARE ALREADY DISPLAYING THOSE MESSAGE ON VALIDATION BEFORE SUBMITTING THE FORM
     * ALSO, USERNAME MAY NOT BE NEEDED BECAUSE IT IS BEING VALIDATED BEFORE SUBMIT - NEEDS TESTING
     */

    const { graphQLErrors } = error;

    if (graphQLErrors) {
      if (graphQLErrors.length) {
        const {
          extensions: { validation }
        } = graphQLErrors[0];
        if (validation['input.username']) throw new Error('USERNAME_ERROR');

        if (validation['input.email']) throw new Error('EMAIL_ERROR');

        // if (validation['input.password'])
        //   throw new Error(validation['input.password'][0].replace('input.', ''));

        // if above conditions are not met
        throw new Error('there is error in graphql operation');
      }
      throw new Error(error);
    }

    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const { data } = await client.mutate({
      mutation: SIGN_OUT
    });
    console.log({ logoutData: data });
    // return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const validateUsername = async (input) => {
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: VALIDATE_USERNAME,
      variables: input
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error('USERNAME_ERROR');
  }
};
