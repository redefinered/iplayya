/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as MovieActionCreators } from 'modules/ducks/movie/movie.actions';
import { selectMovies } from 'modules/ducks/movie/movie.selectors';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo
} from 'modules/ducks/movie/movie.selectors';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from 'components/button/button.component';
import { urlEncodeTitle } from 'utils';

const dummydata = [
  {
    id: 1,
    title: 'Movie Number One',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('Movie Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Movie',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Another Sample Movie'
    )}`
  },
  {
    id: 3,
    title: 'Lorem Ipsum Reloaded',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Lorem Ipsum Reloaded'
    )}`
  },
  {
    id: 4,
    title: 'The Dark Example',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('The Dark Example')}`
  },
  {
    id: 5,
    title: 'John Weak 5',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('John Weak 5')}`
  },
  {
    id: 6,
    title: 'The Past and The Furriest 8',
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  }
];

const ImovieScreen = ({ navigation, error, getMoviesAction, paginatorInfo, ...otherprops }) => {
  const { limit, pageNumber } = paginatorInfo;
  console.log({ paginatorInfo });

  // React.useEffect(() => {
  //   getMoviesAction({ limit, pageNumber });
  // }, []);

  let { movies } = otherprops;

  const urlEncodeTitle = (title) => {
    const strsplit = title.split();
    return strsplit.join('+');
  };

  movies = movies.length ? movies : dummydata;

  console.log({ movies });

  if (error) {
    <Text>{error}</Text>;
  }

  /**
   * TEMPORARY FEATURED ITEMS
   * change to featured category when API is ready
   */
  const featuredItems = movies.slice(0, 5);

  const handleMovieSelect = (videoId) => {
    navigation.navigate('MovieDetailScreen', { videoId });
  };

  return (
    <View style={styles.container}>
      {movies.length ? (
        <React.Fragment>
          <ScrollView>
            {/* featured items section */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Featured Movies
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {featuredItems.map(({ id, title, thumbnail: url }) => (
                  <Pressable
                    onPress={() => handleMovieSelect(id)}
                    key={id}
                    style={{ marginRight: 10 }}
                  >
                    <Image style={{ width: 336, height: 190, borderRadius: 8 }} source={{ url }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* new releases */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>New Releases</Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {featuredItems.map(({ id, title, thumbnail: url }) => (
                  <Pressable key={id} style={{ marginRight: 10 }}>
                    <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* continue watching */}
            <View style={{ marginBottom: 30, paddingBottom: 100 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Continue watching
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {featuredItems.map(({ id, title, thumbnail: url }) => (
                  <Pressable key={id} style={{ marginRight: 10 }}>
                    <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </React.Fragment>
      ) : (
        <ContentWrap>
          <Text>No movies found</Text>
          <Button mode="contained" onPress={() => navigation.navigate('MovieDetailScreen')}>
            <Text>test</Text>
          </Button>
        </ContentWrap>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 30,
          paddingTop: 15,
          paddingBottom: 30,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
          <Icon name="heart-solid" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Favorites</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
          <Icon name="download" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Downloaded</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movies: selectMovies,
  paginatorInfo: selectPaginatorInfo
});

const actions = {
  getMoviesAction: MovieActionCreators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ImovieScreen);
