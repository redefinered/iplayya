import client from 'apollo/client';
import {
  GET_FEATURED_MOVIES,
  GET_CATEGORIES,
  GET_MOVIES_BY_CATEGORIES
} from 'graphql/movies.graphql';

/**
 * TEMPORARY: we use `movies` query for now since there is no query
 * for featured movies yet
 * @param {object} input the input object that is the argument for
 * graphql query `movies`
 */
export const getFeaturedMovies = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_FEATURED_MOVIES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCategories = async () => {
  try {
    const { data } = await client.query({
      query: GET_CATEGORIES
    });
    console.log({ datax: data });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getMoviesByCategories = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_MOVIES_BY_CATEGORIES,
      variables: input
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
