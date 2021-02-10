import client from 'apollo/client';
import { GET_GENRES, GET_CHANNELS, GET_TV_CHANNELS_BY_CATEGORIES } from 'graphql/itv.graphql';

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
  console.log({ i: input });
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
