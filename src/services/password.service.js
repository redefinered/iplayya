import { gql } from '@apollo/client';
import { clientWithoutAuthLink } from 'apollo/client';

export const update = async (form) => {
  const { ...input } = form;
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: gql`
        mutation RESET_PASSWORD($input: NewPasswordWithCodeInput!) {
          updateForgottenPassword(input: $input) {
            status
            message
          }
        }
      `,
      variables: { input }
    });
    return data;
  } catch ({ graphQLErrors }) {
    console.log({ graphQLErrors });
    // throw new Error(error);

    const {
      extensions: { errors }
    } = graphQLErrors[0];
    if (errors.token) throw new Error(errors.token);
    throw new Error({ graphQLErrors });
  }
};

export const getLink = async (form) => {
  const { ...input } = form;
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: gql`
        mutation FORGOT_PASSWORD($input: ForgotPasswordInput!) {
          forgotPassword(input: $input) {
            status
            message
          }
        }
      `,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const changePassword = async (form) => {
  const { ...input } = form;
  try {
    const { data } = await clientWithoutAuthLink.mutate({
      mutation: gql`
        mutation CHANGE_PASSWORD($input: UpdatePassword!) {
          updatePassword(input: $input) {
            status
            message
          }
        }
      `,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
