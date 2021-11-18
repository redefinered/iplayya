import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import theme from 'common/theme';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';
import { db } from 'firebase/firebase.client';
import { OMDB_API_KEY, RAPID_API_KEY } from '@env';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const MovieItem = ({ item, onSelect, downloadedThumbnail }) => {
  const imdbIdCollection = React.useRef(db.collection('imdb-thumbnails'));
  // console.log(item.title, { downloadedThumbnail });
  const { id, is_series, title, tmdb, kinopoisk } = item;

  const [thumbnail, setThumbnail] = React.useState(null);
  const [imgGetError, setImgGetError] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [imgGetErrorOmdb, setImgGetErrorOmdb] = React.useState(false); /// we can use this error to call the next priority image source

  React.useEffect(() => {
    getThumbnail();

    recordImbdId();
  }, []);

  React.useEffect(() => {
    if (imgGetError) {
      /// try omdb if kino
      getImageFromOmdb();
    }
  }, [imgGetError]);

  const getImageFromOmdb = async (imdbid = null) => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    const url = imdbid
      ? `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbid}`
      : `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${item.title}`;

    try {
      /// fetch the data
      const { data } = await axios.get(url);

      const { Poster: poster } = data;

      // if (!poster) throw new Error('alaws thumbnail sorry reps');

      setThumbnail(poster);

      /// put back image fetch error to false if this finds an image
      setImgGetError(false);
    } catch (error) {
      console.log(`omdb error for "${item.title}" ->`, { error });

      setImgGetErrorOmdb(true);
    }
  };

  // records imdb id of a movie to firebase
  const saveImdbDetails = async ({ t, imdbid }) => {
    try {
      const data = {
        imdbid,
        t
      };

      await db.collection('imdb-thumbnails').doc(item.id).set(data);
    } catch (error) {
      console.log(`firestore error: ${error.message}`);
    }
  };

  const recordImbdId = async () => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    /// searches imdb-unofficial for item title then saves imdb id to firebase
    try {
      const cleanTitle = item.title.replace(/\.|#/g, ''); // removes dots and #-signs for better performance with imdb-unofficial
      // console.log({ cleanTitle });
      const c = {
        method: 'get',
        url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${cleanTitle}`,
        headers: {
          'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        }
      };
      const { data } = await axios(c);
      const { titles } = data;

      // stop if no result
      if (!titles.length) return;

      /// save imdb id in firestore for future referrence
      return saveImdbDetails({ t: item.title, imdbid: titles[0].id });
    } catch (error) {
      await db.collection('no-imdb-search-result').doc(item.id).set({ t: item.title });
      console.log(`imdbx error: ${error.message}`);
    }
  };

  const downloadThumbnail = async (src) => {
    return await RNFetchBlob.config({
      fileCache: true,
      path: `${downloadPath}/mt_${id}_.jpg`
    }).fetch('GET', src);
  };

  const getThumbnail = async () => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    /// get thumbnail from local filesystem
    if (downloadedThumbnail) return setThumbnail(`${downloadPath}/${downloadedThumbnail}`);

    /// if not in fs get from tmdb
    if (tmdb) {
      try {
        const { api_link } = tmdb[0];
        const { data } = await axios.get(api_link);

        const { poster_path } = data;
        const thumbnailUrl = `https://image.tmdb.org/t/p/w200/${poster_path}`;

        // set state thumbnail
        setThumbnail(thumbnailUrl);

        /// download the image so next time this movies is displayed it's faster
        return downloadThumbnail(thumbnailUrl);
      } catch (error) {
        setImgGetError(true);
        // console.log(`tmdb error for "${item.title}" ->`, { error: error.toJSON().message });
      }
    }

    const docRef = imdbIdCollection.current.doc(item.id);
    const snapshot = await docRef.get();

    if (snapshot) {
      /// if document exists basing from this item's ID
      const d = snapshot.data();
      if (d) return getImageFromOmdb(d.imdbid);
    }

    // console.log({ data: snapshot.data() });
    /// if not in tmbd get from kinopoisk
    if (kinopoisk) {
      try {
        const { api_link, api_key } = kinopoisk[0];
        const { data } = await axios({
          method: 'get',
          url: api_link,
          headers: { 'X-API-KEY': api_key }
        });

        const { posterUrl } = data;

        // set state thumbnail
        setThumbnail(posterUrl);

        /// download the image so next time this movies is displayed it's faster
        return downloadThumbnail(posterUrl);
      } catch (error) {
        setImgGetError(true);
        // console.log(`kinopoisk error for "${item.title}" ->`, { error: error.toJSON().message });
      }
    }
  };

  const renderContent = () => {
    if (!thumbnail) {
      return (
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: theme.iplayya.colors.white10,
            borderRadius: 8,
            padding: theme.spacing(1)
          }}
        >
          <Text style={{ fontSize: 16, color: theme.iplayya.colors.vibrantpussy }}>{title}</Text>
        </View>
      );
    }
    // console.log(item.title, thumbnail);
    return (
      <View
        style={{
          width: CARD_DIMENSIONS.WIDTH,
          height: CARD_DIMENSIONS.HEIGHT,
          backgroundColor: theme.iplayya.colors.white10,
          borderRadius: 8
        }}
      >
        <Image
          style={{ width: CARD_DIMENSIONS.WIDTH, height: CARD_DIMENSIONS.HEIGHT, borderRadius: 8 }}
          source={{ uri: thumbnail }}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={{ marginRight: 10, marginBottom: theme.spacing(2) }}
      onPress={() => onSelect({ id, is_series })}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

MovieItem.propTypes = {
  item: PropTypes.object,
  onSelect: PropTypes.func,
  downloadedThumbnail: PropTypes.string
};

export default MovieItem;
