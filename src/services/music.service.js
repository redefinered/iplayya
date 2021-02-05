import client from 'apollo/client';
import { GET_MOVIE, GET_MOVIES } from 'graphql/movie.graphql';

export const getOne = async (id) => {
  try {
    const { data } = await client.query({
      query: GET_MOVIE,
      variables: { id }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const get = async (args) => {
  const { limit, pageNumber } = args;
  try {
    const { data } = await client.query({
      query: GET_MOVIES,
      variables: { input: { limit, pageNumber } }
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};
