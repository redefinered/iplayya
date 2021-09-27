import client from 'apollo/client';
import {
  GET_GENRES,
  GET_TRACKS_BY_ALBUM,
  GET_ALBUM_DETAILS,
  GET_ALBUMS_BY_GENRES
} from 'graphql/music.graphql';

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

export const getAlbumsByGenres = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_ALBUMS_BY_GENRES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAlbumDetails = async (albumId) => {
  try {
    const { data } = await client.query({
      query: GET_ALBUM_DETAILS,
      variables: { input: { albumId } }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getTracksByAlbum = async (input) => {
  try {
    const { data } = await client.query({
      query: GET_TRACKS_BY_ALBUM,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
