import client from 'apollo/client';
import {
  GET_GENRES,
  GET_CHANNEL,
  GET_CHANNELS,
  // GET_CHANNEL_TOKEN,
  GET_SPORTS_CHANNELS_BY_CATEGORIES,
  REMOVE_FROM_FAVORITES,
  GET_FAVORITES,
  GET_PROGRAMS_BY_CHANNEL,
  SEARCH
} from 'graphql/isports.graphql';

import { GET_CHANNEL_TOKEN } from 'graphql/itv.graphql';

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

export const getChannelToken = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_CHANNEL_TOKEN,
      variables: { input }
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
      query: GET_SPORTS_CHANNELS_BY_CATEGORIES,
      variables: { input }
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

      // this updates the favorites list in local cache
      update(cache, { data }) {
        cache.modify({
          fields: {
            favoriteIsports: (previous = []) => {
              const normalizedId = cache.identify({
                id: data.removeIsportToFavorites.id,
                __typename: 'ISports'
              });
              const updatedItems = previous.filter((r) => r.__ref !== normalizedId);

              return updatedItems;
            },
            isport: (_previous, { toReference }) => {
              return toReference(data.removeIsportToFavorites);
            }
          }
        });
      }
    });

    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};

export const getFavorites = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_FAVORITES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProgramsByChannel = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_PROGRAMS_BY_CHANNEL,
      variables: { input }
    });
    return data;
  } catch (error) {
    console.log({ graphqlerror: error.message });
    throw new Error(error);
  }
};

export const search = async (input) => {
  try {
    const { data } = await client.query({
      query: SEARCH,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
