import client from 'apollo/client';
import {
  GET_GENRES,
  GET_ALBUM,
  GET_ALBUMS_BY_GENRE,
  SEARCH,
  ADD_ALBUM_TO_FAVORITES,
  ADD_TRACK_TO_FAVORITES,
  REMOVE_ALBUM_FORM_FAVORITES,
  REMOVE_TRACK_FROM_FAVORITES
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

/// favorites

export const addAlbumToFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_ALBUM_TO_FAVORITES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const addTrackToFavorites = async (input) => {
  try {
    const { data } = await client.mutate({
      mutation: ADD_TRACK_TO_FAVORITES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeAlbumFromFavorites = async (input) => {
  try {
    const { data } = await client.query({
      query: REMOVE_ALBUM_FORM_FAVORITES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const removeTrackFromFavorites = async (input) => {
  try {
    const { data } = await client.query({
      query: REMOVE_TRACK_FROM_FAVORITES,
      variables: { input }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
