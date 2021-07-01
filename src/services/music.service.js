import client from 'apollo/client';
import { GET_GENRES, GET_ALBUM, GET_ALBUMS_BY_GENRE, SEARCH } from 'graphql/music.graphql';

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

export const getAlbumsByGenre = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_ALBUMS_BY_GENRE,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAlbum = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_ALBUM,
      variables: { input }
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
