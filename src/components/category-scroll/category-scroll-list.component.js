import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, FlatList, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError } from 'modules/ducks/movies/movies.selectors';
import { Creators } from 'modules/ducks/movies/movies.actions';
import theme from 'common/theme';

const SPACING_FOR_CARD_INSET = theme.spacing(2);
const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const CategoryScrollList = ({
  data,
  onSelect,
  isFetching,
  paginatorOfCategory,
  getMoviesByCategoriesAction
}) => {
  const brand = theme.iplayya.colors;

  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View
        style={{
          width: CARD_DIMENSIONS.WIDTH,
          height: CARD_DIMENSIONS.HEIGHT,
          borderRadius: 8,
          backgroundColor: brand.white10,
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator />
      </View>
    );
  };

  const renderThumbnail = (uri, title) => {
    if (!uri) {
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
          <Text style={{ fontSize: 16, color: brand.vibrantpussy }}>{title}</Text>
        </View>
      );
    }
    return (
      <Image
        style={{ width: CARD_DIMENSIONS.WIDTH, height: CARD_DIMENSIONS.HEIGHT, borderRadius: 8 }}
        source={{ uri }}
      />
    );
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, thumbnail: uri, title, is_series } }) => {
    return (
      <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onSelect({ id, is_series })}>
        {renderThumbnail(uri, title)}
      </TouchableOpacity>
    );
  };

  const handleOnEndReached = () => {
    // set pageNumber prop to get the next n movies
    console.log('end');
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
        bottom: 0
        // left: SPACING_FOR_CARD_INSET,
        // right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        paddingHorizontal: SPACING_FOR_CARD_INSET
      }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={() => handleOnEndReached()}
      onEndReachedThreshold={0}
      ListFooterComponent={renderListFooter()}
    />
  );
};

CategoryScrollList.propTypes = {
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

export default connect(mapStateToProps, actions)(React.memo(CategoryScrollList));
