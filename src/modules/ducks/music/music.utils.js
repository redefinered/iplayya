import uniqBy from 'lodash/unionBy';

export const updateMusicState = (state, newAlbums) => {
  let { albums } = state;

  if (!newAlbums.length) return albums;

  const index = albums.findIndex(({ genre }) => genre === newAlbums[0].genre);
  const moviesToUpdate = albums.find(({ genre }) => genre === newAlbums[0].genre);
  const mergedMovies = [...moviesToUpdate.videos, ...newAlbums];

  // update albums
  albums.splice(index, 1, { genre: albums[index].genre, videos: uniqBy(mergedMovies, 'id') });

  return albums;
};

export const updatePaginatorInfo = (state, newAlbums, nextPaginator) => {
  const { paginatorInfo } = state;

  if (!newAlbums.length) return paginatorInfo;

  const prevPaginator = paginatorInfo.find(({ title }) => title === newAlbums[0].genre);
  const index = paginatorInfo.findIndex(({ title }) => title === newAlbums[0].genre);

  const paginator = Object.assign(prevPaginator, { paginator: nextPaginator });

  paginatorInfo.splice(index, 1, paginator);

  return paginatorInfo;
};

export const setupPaginator = (genres) => {
  return genres.map(({ id, name: title }) => ({
    id,
    title,
    paginator: { pageNumber: 1, limit: 10, genres: [parseInt(id)] }
  }));
};
