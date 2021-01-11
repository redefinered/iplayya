import client from 'apollo/client';
import { UPDATE_PLAYBACK_SETTINGS } from 'graphql/user.graphql';
import { GET_PROFILE } from 'graphql/profile.graphql';
import { SET_PROVIDER } from 'graphql/provider.graphql';

export const updatePlaybackSettings = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: UPDATE_PLAYBACK_SETTINGS,
      variables: { input },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const setProvider = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: SET_PROVIDER,
      variables: { input },
      refetchQueries: [{ query: GET_PROFILE }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
