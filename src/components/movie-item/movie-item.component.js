import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, TouchableOpacity } from 'react-native';
import Icon from 'components/icon/icon.component';
import { Text } from 'react-native-paper';
import theme from 'common/theme';
import { MovieContext } from 'contexts/providers/movie/movie.provider';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { OMDB_API_KEY, RAPID_API_KEY } from '@env';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const MovieItem = ({ id, title, rating_imdb, is_series, tmdb }) => {
  let source = axios.CancelToken.source();

  const { setSelected } = React.useContext(MovieContext);

  const [thumbnail, setThumbnail] = React.useState(null);

  // eslint-disable-next-line no-unused-vars
  const [imgGetErrorOmdb, setImgGetErrorOmdb] = React.useState(false); /// we can use this error to call the next priority image source

  React.useEffect(() => {
    getThumbnail();
  });

  React.useEffect(() => {
    return () => source.cancel();
  }, []);

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

  const getMovieDataFromImdbOfficial = async (title) => {
    try {
      const cleanTitle = title.replace(/\.|#/g, '');

      const { data } = await axios({
        method: 'get',
        url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${cleanTitle}`,
        headers: {
          'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com',
          'x-rapidapi-key': RAPID_API_KEY
        },
        cancelToken: source.token
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * sets thumbnail in the following priority of sources
   * 1. tmdb
   * 2. imdb-unofficial API
   * 3. omdb
   * ** download thumbnail will be implemented later
   * @returns void
   */
  const getThumbnail = async () => {
    // stop if movie already has a thumbnail
    if (thumbnail) return;

    /// implement download later
    // const isDownloaded = isMovieDownloaded(
    //   { id, title, rating_imdb, is_series, tmdb, kinopoisk, dlfname },
    //   downloads
    // );
    /// get thumbnail from local filesystem
    // if (isDownloaded) return setThumbnail(`${downloadPath}/${dlfname}`);

    // if not in fs get from tmdb
    try {
      if (tmdb) {
        let API_URL = null;
        const { api_link } = tmdb[0];

        if (is_series) {
          API_URL = api_link.replace(/\/movie/, '/tv');
        } else {
          API_URL = api_link;
        }

        const { data } = await axios.get(API_URL, { cancelToken: source.token });

        const { poster_path } = data;
        const thumbnailUrl = `https://image.tmdb.org/t/p/w200/${poster_path}`;

        // set state thumbnail
        return setThumbnail(thumbnailUrl);
      }

      // for items that has no TMDB data try getting info from IMDB unofficial api
      const { id: imdbId, poster } = await getMovieDataFromImdbOfficial(title);

      if (!poster && id) {
        /// for items without poster but has imdbid, try getting thumbnail frim OMDB using imdbid
        const posterFromOmdb = await getThumbnailFromOmdb(imdbId);
        return setThumbnail(posterFromOmdb);
      }

      return setThumbnail(poster);
    } catch (error) {
      console.log(`image fetch error: ${error.message}`);
      // setThumbnailFetchError(true);
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
            // onLoadStart={() => setLoadingThumbnail(true)}
            // onLoadEnd={() => setLoadingThumbnail(false)}
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
