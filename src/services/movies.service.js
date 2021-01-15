import client from 'apollo/client';
import { GET_MOVIE, GET_CATEGORIES, GET_MOVIES_BY_CATEGORIES } from 'graphql/movies.graphql';

export const getMovie = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_MOVIE,
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
