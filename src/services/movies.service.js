import client from 'apollo/client';
// import { Platform } from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';

// const DIRS = RNFetchBlob.fs.dirs;

import {
  GET_MOVIE,
  GET_CATEGORIES,
  GET_MOVIES_BY_CATEGORIES,
  ADD_MOVIE_TO_FAVORITES,
  GET_FAVORITE_MOVIES
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
    throw new Error(error);
  }
};

export const addMovieToFavorites = async (videoId) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_MOVIE_TO_FAVORITES,
      variables: { input: { videoId } },
      refetchQueries: [{ query: GET_FAVORITE_MOVIES }],
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

// export const downloadMovie = async (movieData) => {
//   const { title, url } = movieData;
//   console.log({ title, url });
//   try {
//     const titleSplit = title.split();
//     const filename = titleSplit.join('_');
//     const path =
//       Platform.OS === 'ios'
//         ? `${DIRS.DocumentDir}/${filename}.mp4`
//         : // if android use downloads directory
//           `${DIRS.DownloadDir}/${filename}.mp4`;
//     let task = await RNFetchBlob.config({
//       // add this option that makes response data to be stored as a file,
//       // this is much more performant.
//       fileCache: true,
//       path
//     }).fetch('GET', url, {});

//     console.log({ task });

//     task.cancel();

//     return task;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
