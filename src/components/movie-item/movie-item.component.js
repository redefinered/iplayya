import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, TouchableOpacity } from 'react-native';
// import { View, Image, TouchableOpacity, StyleSheet, InteractionManager } from 'react-native';
import Icon from 'components/icon/icon.component';
import { Text } from 'react-native-paper';
import theme from 'common/theme';
import { MovieContext } from 'contexts/providers/movie/movie.provider';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
// import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';
// import { db } from 'firebase/firebase.client';
import { OMDB_API_KEY, RAPID_API_KEY } from '@env';
import { isMovieDownloaded } from 'screens/imovie/imovie.screen.utils';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const MovieItem = ({ id, title, rating_imdb, is_series, tmdb, kinopoisk, dlfname }) => {
  let source = axios.CancelToken.source();

  const { downloads } = React.useContext(MovieContext);
  const { setSelected } = React.useContext(MovieContext);
  // const { id, is_series, title, tmdb, kinopoisk } = item;

  // const imdbIdCollection = React.useRef(db.collection('imdb-thumbnails'));

  // const [imdbId, setImdbId] = React.useState(null);
  const [thumbnail, setThumbnail] = React.useState(null);
  const [loadingThumbnail, setLoadingThumbnail] = React.useState(false);
  const [thumbnailFetchError, setThumbnailFetchError] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState({ width: 0, height: 0 });

  // eslint-disable-next-line no-unused-vars
  const [imgGetErrorOmdb, setImgGetErrorOmdb] = React.useState(false); /// we can use this error to call the next priority image source

  React.useEffect(() => {
    getThumbnail();
  });

  React.useEffect(() => {
    return () => source.cancel();
  }, []);

  // React.useEffect(() => {
  //   if (imgGetError) {
  //     /// try omdb if kino
  //     getImageFromOmdb();
  //   }
  // }, [imgGetError]);

  // records imdb id of a movie to firebase
  // const saveImdbDetails = async ({ t, imdbid }) => {
  //   try {
  //     const data = {
  //       imdbid,
  //       t
  //     };

  //     await db.collection('imdb-thumbnails').doc(item.id).set(data);
  //   } catch (error) {
  //     console.log(`firestore error: ${error.message}`);
  //   }
  // };

  /// TODO: transfer to redux-saga so it does not affect UI performance
  /// TODO: transfer to redux-saga so it does not affect UI performance
  /// TODO: transfer to redux-saga so it does not affect UI performance
  /// TODO: transfer to redux-saga so it does not affect UI performance
  // const recordImbdId = async () => {
  //   // stop if movie already has a thumbnail
  //   if (thumbnail) return;

  //   /// searches imdb-unofficial for item title then saves imdb id to firebase
  //   try {
  //     const cleanTitle = item.title.replace(/\.|#/g, ''); // removes dots and #-signs for better performance with imdb-unofficial
  //     // console.log({ cleanTitle });
  //     const c = {
  //       method: 'get',
  //       url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${cleanTitle}`,
  //       headers: {
  //         'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
  //         'x-rapidapi-key': RAPID_API_KEY
  //       }
  //     };
  //     const { data } = await axios(c);
  //     const { titles } = data;

  //     // stop if no result
  //     if (typeof titles === 'undefined') return;
  //     if (!titles.length) return;

  //     /// save imdb id in firestore for future referrence
  //     return saveImdbDetails({ t: item.title, imdbid: titles[0].id });
  //   } catch (error) {
  //     // console.log({ id: item.id, title: item.title });
  //     await db.collection('no-imdb-search-result').doc(item.id).set({ t: item.title });
  //     console.log(`imdbx error: ${error.message}`);
  //   }
  // };

  // const downloadThumbnail = async (src) => {
  //   return await RNFetchBlob.config({
  //     fileCache: true,
  //     path: `${downloadPath}/mt_${id}_.jpg`
  //   }).fetch('GET', src);
  // };

  const getThumbnailFromOmdb = async (imdbid = null) => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    const url = imdbid
      ? `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbid}`
      : `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${title}`;

    try {
      /// fetch the data
      const { data } = await axios.get(url, { cancelToken: source.token });

      // console.log({ data });
      const { Poster: poster } = data;

      // if (!poster) throw new Error('alaws thumbnail sorry reps');

      return poster;
    } catch (error) {
      throw new Error(error);
    }
  };

  // const getThumbnailFromImdbUnofficial = async (title) => {
  //   try {
  //     const cleanTitle = title.replace(/\.|#/g, '');

  //     const { data } = await axios({
  //       method: 'get',
  //       url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${cleanTitle}`,
  //       headers: {
  //         'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
  //         'x-rapidapi-key': RAPID_API_KEY
  //       }
  //     });

  //     return data;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

  const getImdbIdFromImdbUnofficial = async (title) => {
    try {
      const cleanTitle = title.replace(/\.|#/g, '');

      const { data } = await axios({
        method: 'get',
        url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${cleanTitle}`,
        headers: {
          'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        },
        cancelToken: source.token
      });
      // console.log({ data });
      if (title === '13 Reasons Why') console.log(data.titles[0].id);
      return data.titles[0].id;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getThumbnail = async () => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    const isDownloaded = isMovieDownloaded(
      { id, title, rating_imdb, is_series, tmdb, kinopoisk, dlfname },
      downloads
    );
    /// get thumbnail from local filesystem
    if (isDownloaded) return setThumbnail(`${downloadPath}/${dlfname}`);

    // if not in fs get from tmdb
    try {
      if (tmdb) {
        const { api_link } = tmdb[0];
        const { data } = await axios.get(api_link, { cancelToken: source.token });

        const { poster_path } = data;
        const thumbnailUrl = `https://image.tmdb.org/t/p/w200/${poster_path}`;

        // set state thumbnail
        return setThumbnail(thumbnailUrl);
      }

      // const d = await getThumbnailFromOmdb();
      const imdbid = await getImdbIdFromImdbUnofficial(title);

      const d = await getThumbnailFromOmdb(imdbid);

      return setThumbnail(d);
      // console.log({ d });

      // const { titles } = await getThumbnailFromImdbUnofficial(title);

      // const { image } = titles[0];

      // return setThumbnail(image);

      // if (kinopoisk) {
      //   const { api_link, api_key } = kinopoisk[0];
      //   const { data } = await axios({
      //     method: 'get',
      //     url: api_link,
      //     headers: { 'X-API-KEY': api_key }
      //   });

      //   const { posterUrl } = data;

      //   // set state thumbnail
      //   return setThumbnail(posterUrl);
      // }
    } catch (error) {
      console.log(`image fetch error: ${error.message}`);
      setThumbnailFetchError(true);
    }
  };

  const renderContent = () => {
    const renderRating = (r) => {
      if (!parseFloat(r)) return;

      return (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing(1) }}
        >
          <Icon name="star" size={20} color="#FEC92E" style={{ marginRight: 3 }} />
          <Text style={{ fontSize: 12 }}>{parseFloat(r).toFixed(1)}</Text>
        </View>
      );
    };

    const renderThumnail = () => {
      if (!thumbnail)
        return (
          <LinearGradient
            colors={['#2C1449', '#0E0638']}
            style={{
              width: CARD_DIMENSIONS.WIDTH,
              height: CARD_DIMENSIONS.HEIGHT,
              borderRadius: 8,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image source={require('assets/movie-thumbnail-placeholder.png')} />
          </LinearGradient>
        );

      return (
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            borderRadius: 8,
            marginRight: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            onLoadStart={() => setLoadingThumbnail(true)}
            onLoadEnd={() => setLoadingThumbnail(false)}
            style={{
              width: CARD_DIMENSIONS.WIDTH,
              height: CARD_DIMENSIONS.HEIGHT,
              borderRadius: 8
            }}
            source={{ uri: thumbnail }}
          />
        </View>
      );
    };

    return (
      <View>
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: theme.iplayya.colors.white10,
            borderRadius: 8,
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {renderThumnail()}
        </View>

        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            paddingTop: theme.spacing(2)
          }}
        >
          {renderRating(rating_imdb)}
          <Text numberOfLines={2} style={{ fontSize: 12 }}>
            {title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={{ marginRight: 10, marginBottom: theme.spacing(2) }}
      onPress={() => setSelected({ id, is_series })}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

MovieItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating_imdb: PropTypes.string.isRequired,
  is_series: PropTypes.bool.isRequired,
  tmdb: PropTypes.array,
  kinopoisk: PropTypes.array,
  dlfname: PropTypes.string
};

export default MovieItem;
