import client from 'apollo/client';
import {
  GET_RADIO_STATIONS,
  ADD_RADIO_TO_FAVORITES,
  REMOVE_RADIO_FROM_FAVORITES,
  GET_FAVORITE_RADIOS
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

export const addToFavorites = async (radioId) => {
  console.log({ radioIdxxxxx: radioId });
  try {
    const { data } = await client.mutate({
      mutation: ADD_RADIO_TO_FAVORITES,
      variables: { input: { radioId } },
      refetchQueries: [
        /// TODO: input variables should come from this function's arguments
        // form pagination to work
        { query: GET_FAVORITE_RADIOS, variables: { input: { limit: 10, pageNumber: 1 } } },
        { query: GET_RADIO_STATIONS, variables: { input: { limit: 10, pageNumber: 1 } } }
      ],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeFromFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_RADIO_FROM_FAVORITES,
      variables: { input },
      refetchQueries: [
        /// TODO: input variables should come from this function's arguments
        // form pagination to work
        { query: GET_FAVORITE_RADIOS, variables: { input: { limit: 10, pageNumber: 1 } } },
        { query: GET_RADIO_STATIONS, variables: { input: { limit: 10, pageNumber: 1 } } }
      ],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
