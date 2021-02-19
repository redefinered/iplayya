import client from 'apollo/client';
import {
  GET_GENRES,
  GET_CHANNEL,
  GET_CHANNELS,
  GET_TV_CHANNELS_BY_CATEGORIES,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  GET_FAVORITES
} from 'graphql/itv.graphql';

export const getGenres = async () => {
  try {
    const { data } = await client.query({
      query: GET_GENRES
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getChannel = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_CHANNEL,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getChannels = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_CHANNELS,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getChannelsByCategory = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_TV_CHANNELS_BY_CATEGORIES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const addToFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TO_FAVORITES,
      variables: { input },
      refetchQueries: [
        {
          query: GET_FAVORITES,
          variables: { input: { limit: 10, pageNumber: 1 } },
          fetchPolicy: 'network-only'
        },
        {
          query: GET_CHANNELS,
          variables: { input: { limit: 10, pageNumber: 1 } },
          fetchPolicy: 'network-only'
        }
      ],
      awaitRefetchQueries: true
      // this query should refetch favorites each time an item
      // is added to favorites
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeFromFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_FROM_FAVORITES,
      variables: { input },
      refetchQueries: [
        {
          query: GET_FAVORITES,
          variables: { input: { limit: 10, pageNumber: 1 } },
          fetchPolicy: 'network-only'
        },
        {
          query: GET_CHANNELS,
          variables: { input: { limit: 10, pageNumber: 1 } },
          fetchPolicy: 'network-only'
        }
      ],
      awaitRefetchQueries: true
    });
    // console.log({ data });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFavorites = async (input) => {
  console.log({ getFavoritesInput: input });
  try {
    const { data } = await client.query({
      query: GET_FAVORITES,
      variables: { input: { limit: 10, pageNumber: 1 } }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
