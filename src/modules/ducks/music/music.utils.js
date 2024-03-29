import uniqBy from 'lodash/uniqBy';

export const repeatTypes = [
  { order: 1, value: 'none' },
  { order: 2, value: 'all' },
  { order: 3, value: 'one' }
];

export const updateMusicState = (state, newAlbums) => {
  let { albums } = state;

  if (!newAlbums.length) return albums;

  const index = albums.findIndex(({ genre }) => genre === newAlbums[0].genre);
  const albumsToUpdate = albums.find(({ genre }) => genre === newAlbums[0].genre);
  const mergedAlbums = [...albumsToUpdate.albums, ...newAlbums];

  // update albums
  albums.splice(index, 1, { genre: albums[index].genre, albums: uniqBy(mergedAlbums, 'id') });

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

export const shuffleTrackNumbers = (trackNumbers) => {
  let currentIndex = trackNumbers.length;
  let randomIndex = null;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [trackNumbers[currentIndex], trackNumbers[randomIndex]] = [
      trackNumbers[randomIndex],
      trackNumbers[currentIndex]
    ];
  }

  return trackNumbers.map((n) => parseInt(n));
};
