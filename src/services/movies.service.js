import client from 'apollo/client';
import {
  GET_MOVIE,
  GET_CATEGORIES,
  GET_MOVIES_BY_CATEGORIES,
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
      query: GET_CATEGORIES,
      fetchPolicy: 'network-only'
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
    // console.log({ error });
    // if (error.graphQLErrors.length) {
    //   const err = error.graphQLErrors[0];
    //   /// sometimes error message comes from extensions property
    //   if (err.extensions) throw new Error(err.extensions.reason);

    //   throw new Error(err.debugMessage);
    // }
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
            favoriteVideos: (previous = []) => {
              const normalizedId = cache.identify({
                id: data.removeVideoToFavorites.id,
                __typename: 'Video'
              });
              const updatedItems = previous.filter((r) => r.__ref !== normalizedId);
              return updatedItems;
            },
            video: (_previous, { toReference }) => {
              return toReference(data.removeVideoToFavorites);
            }
          }
        });
      }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFavoriteMovies = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_FAVORITE_MOVIES,
      variables: { input }
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
    // console.log({ error });
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
