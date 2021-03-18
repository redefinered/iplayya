/* eslint-disable no-unused-vars */

import client from 'apollo/client';
import { CREATE_PROVIDER, UPDATE_PROVIDER, DELETE_PROVIDER } from 'graphql/provider.graphql';
import { GET_PROFILE } from 'graphql/profile.graphql';

export const get = async () => {
  try {
    const { data } = await client.query({
      query: GET_PROFILE
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const create = async (args) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_PROVIDER,
      variables: { input: args },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    if (error.graphQLErrors.length) {
      throw new Error(error.graphQLErrors[0].extensions.reason);
    }
    console.log({ error });
    throw new Error(error);
  }
};

export const deleteOne = async (id) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_PROVIDER,
      variables: { id },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const update = async (input) => {
  // console.log({ args });
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PROVIDER,
      variables: { input },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
