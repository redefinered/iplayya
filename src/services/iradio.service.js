import client from 'apollo/client';
import {
  GET_RADIO_STATIONS,
  REMOVE_RADIO_FROM_FAVORITES,
  GET_FAVORITE_RADIOS,
  SEARCH
} from 'graphql/radios.graphql';

/**
 * Fetch radio stations
 * @param {object} input has limit, pageNumber, order (optional), and orderBy (optional) properties
 */
export const getStations = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_RADIO_STATIONS,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFavorites = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_FAVORITE_RADIOS,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

/// IN PROGRESS! addToFavorites and getFavorites

export const removeFromFavorites = async (radioId, pageNumber) => {
  console.log({ pageNumber });
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_RADIO_FROM_FAVORITES,
      variables: { input: { radioId } }
    });
    return data;
  } catch (error) {
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
