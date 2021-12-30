import client from 'apollo/client';
import {
  GET_RADIO_STATIONS,
  ADD_RADIO_TO_FAVORITES,
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
      // fetchPolicy: 'network-only'
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
      // fetchPolicy: 'network-only'
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};

/// IN PROGRESS! addToFavorites and getFavorites

export const addToFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_RADIO_TO_FAVORITES,
      variables: { input }
      // refetchQueries: [
      //   {
      //     query: GET_FAVORITE_RADIOS,
      //     variables: { input: { limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' } },
      //     fetchPolicy: 'network-only'
      //   },

      //   {
      //     query: GET_RADIO_STATIONS,
      //     variables: { input: { limit: 10, pageNumber, orderBy: 'number', order: 'asc' } },
      //     fetchPolicy: 'network-only'
      //   }
      // ],
      // awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};

export const removeFromFavorites = async (radioId, pageNumber) => {
  console.log({ pageNumber });
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_RADIO_FROM_FAVORITES,
      variables: { input: { radioId } },
      refetchQueries: [
        {
          query: GET_FAVORITE_RADIOS,
          variables: { input: { limit: 10, pageNumber, orderBy: 'number', order: 'asc' } },
          fetchPolicy: 'network-only'
        }
        // {
        //   query: GET_RADIO_STATIONS,
        //   variables: { input: { limit: 10, pageNumber, orderBy: 'number', order: 'asc' } },
        //   fetchPolicy: 'network-only'
        // }
      ],
      awaitRefetchQueries: true
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
      fetchPolicy: 'network-only',
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
