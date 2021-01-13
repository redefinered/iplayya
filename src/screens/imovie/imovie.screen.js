/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { selectMovies, selectCategoriesOf } from 'modules/ducks/movies/movies.selectors';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo
} from 'modules/ducks/movies/movies.selectors';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from 'components/button/button.component';
import { urlEncodeTitle } from 'utils';

const ImovieScreen = ({ navigation, error, categories, getMoviesByCategoriesAction, ...rest }) => {
  let movies = rest.movies.map(({ thumbnail, ...rest }) => {
    return {
      thumbnail:
        thumbnail === '' || thumbnail === 'N/A'
          ? `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(rest.title)}`
          : thumbnail,
      ...rest
    };
  });

  React.useEffect(() => {
    let categoriesIds = categories.map(({ id }) => id);

    // the argument for this function should be in the shape of videoRequestByGenre input
    // of videoByCategory query of pur graphql API
    getMoviesByCategoriesAction({ categories: categoriesIds });
  }, [categories, getMoviesByCategoriesAction]);

  if (error) {
    <Text>{error}</Text>;
  }

  /**
   * TEMPORARY FEATURED ITEMS
   * change to featured category when API is ready
   */
  const featuredItems = movies.slice(0, 5);

  const handleMovieSelect = (videoId) => {
    console.log('aasdasd');
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
                {featuredItems.map(({ id, ...itemProps }) => (
                  // <Pressable
                  //   onPress={() => handleMovieSelect(id)}
                  //   key={id}
                  //   style={{ marginRight: 10 }}
                  // >
                  //   <Image style={{ width: 336, height: 190, borderRadius: 8 }} source={{ url }} />
                  // </Pressable>
                  <ItemPreview
                    key={id}
                    variant="image"
                    onSelect={handleMovieSelect}
                    {...itemProps}
                  />
                ))}
              </ScrollView>
            </View>

            {/* new releases */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>New Releases</Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {movies.map(({ id, thumbnail: url }) => (
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
                {movies.map(({ id, thumbnail: url }) => (
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
  paginatorInfo: selectPaginatorInfo,
  categories: selectCategoriesOf('movies')
});

const actions = {
  getMoviesByCategoriesAction: MoviesCreators.getMoviesByCategories,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ImovieScreen);
