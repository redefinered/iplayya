import client from 'apollo/client';
import { GET_PROFILE, UPDATE_PROFILE } from 'graphql/profile.graphql';

export const get = async () => {
  try {
    const { data } = await client.query({
      query: GET_PROFILE,
      fetchPolicy: 'network-only'
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};

export const update = async (input) => {
  // console.log({ args });
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PROFILE,
      variables: { input },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
