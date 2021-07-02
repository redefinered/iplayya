/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, FlatList, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError } from 'modules/ducks/movies/movies.selectors';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { useTheme } from 'react-native-paper';

const coverplaceholder = require('assets/imusic-placeholder.png');

const SPACING_FOR_CARD_INSET = 15;
const CARD_DIMENSIONS = { WIDTH: 148, HEIGHT: 148 };

const GenreScrollList = ({ data, onSelect, getMoviesByCategoriesAction, paginatorOfCategory }) => {
  const theme = useTheme();
  const brand = theme.iplayya.colors;

  // eslint-disable-next-line react/prop-types
  const renderThumbnail = ({ cover, name, performer }) => {
    if (!cover) {
      return (
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            padding: theme.spacing(1)
          }}
        >
          <Text style={{ fontSize: 16, color: brand.vibrantpussy }}>{name}</Text>
        </View>
      );
    }
    return (
      <React.Fragment>
        <Image
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            borderRadius: 8,
            marginBottom: theme.spacing(1)
          }}
          source={coverplaceholder}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            marginBottom: theme.spacing(1),
            maxWidth: 148
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 12, maxWidth: 148 }}>
          {performer}
        </Text>
      </React.Fragment>
    );
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ marginRight: theme.spacing(2) }} onPress={() => onSelect(item)}>
        {renderThumbnail(item)}
      </TouchableOpacity>
    );
  };

  const handleOnEndReached = () => {
    // set pageNumber prop to get the next n albums
    if (typeof paginatorOfCategory === 'undefined') return;
    const { paginator } = paginatorOfCategory;
    getMoviesByCategoriesAction(paginator);
  };

  return (
    <FlatList
      data={data}
      showsHorizontalScrollIndicator={false}
      horizontal
      snapToInterval={CARD_DIMENSIONS.WIDTH + 10}
      snapToAlignment="start"
      contentInset={{
        top: 0,
        bottom: 0,
        left: SPACING_FOR_CARD_INSET,
        right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        // contentInset alternative for Android
        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0 // Horizontal spacing before and after the ScrollView
      }}
      renderItem={renderItem}
      // eslint-disable-next-line react/prop-types
      keyExtractor={(item) => item.id}
      style={{ paddingHorizontal: 10 }}
      onEndReached={() => handleOnEndReached()}
      onEndReachedThreshold={0}
    />
  );
};

GenreScrollList.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  data: PropTypes.array,
  onSelect: PropTypes.func,
  paginatorOfCategory: PropTypes.object,
  getMoviesByCategoriesAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching,
  error: selectError
});

const actions = {
  getMoviesByCategoriesAction: Creators.getMoviesByCategories
};

export default connect(mapStateToProps, actions)(GenreScrollList);
