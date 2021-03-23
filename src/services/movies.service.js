import client from 'apollo/client';
import {
  GET_MOVIE,
  GET_CATEGORIES,
  GET_MOVIES_BY_CATEGORIES,
  ADD_MOVIE_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  GET_FAVORITE_MOVIES,
  GET_DOWNLOADS,
  SEARCH
} from 'graphql/movies.graphql';

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
    console.log({ error });
    if (error.graphQLErrors.length) {
      throw new Error(error.graphQLErrors[0].extensions.reason);
    }
    throw new Error(error);
  }
};

export const addMovieToFavorites = async (videoId) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_MOVIE_TO_FAVORITES,
      variables: { input: { videoId } },
      refetchQueries: [{ query: GET_FAVORITE_MOVIES, fetchPolicy: 'network-only' }],
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
      mutation: REMOVE_FROM_FAVORITES,
      variables: { input },
      refetchQueries: [{ query: GET_FAVORITE_MOVIES, fetchPolicy: 'network-only' }],
      awaitRefetchQueries: true
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFavoriteMovies = async () => {
  try {
    const { data } = await client.query({
      query: GET_FAVORITE_MOVIES
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getDownloads = async (videoIds) => {
  try {
    const { data } = await client.query({
      query: GET_DOWNLOADS,
      variables: { input: { videoIds } }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const search = async (input) => {
  // console.log({ input });
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
