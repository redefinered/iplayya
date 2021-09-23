import client from 'apollo/client';
import { ADD_TRACK_TO_FAVORITES, ADD_ALBUM_TO_FAVORITES } from 'graphql/music.graphql';
import { GET_ALBUM_DETAILS } from 'graphql/music.graphql';

export const addTrackToFavorites = async (trackId) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TRACK_TO_FAVORITES,
      variables: { input: { musicId: trackId } }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const addAlbumToFavorites = async (albumId) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_ALBUM_TO_FAVORITES,
      variables: { input: { albumId } },
      refetchQueries: [
        { query: GET_ALBUM_DETAILS, variables: { input: { albumId } }, fetchPolicy: 'networl-only' }
      ],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
