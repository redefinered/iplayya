import React from 'react';
import PropTypes from 'prop-types';
import MovieItem from 'components/movie-item/movie-item.component';
import { FlatList, View } from 'react-native';
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
  isFetching,
  paginatorOfCategory,
  getMoviesByCategoriesAction
}) => {
  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View
        style={{
          width: CARD_DIMENSIONS.WIDTH,
          height: CARD_DIMENSIONS.HEIGHT,
          borderRadius: 8,
          backgroundColor: theme.iplayya.colors.white10,
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator />
      </View>
    );
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item }) => {
    return <MovieItem {...item} />;
  };

  const handleOnEndReached = () => {
    // set pageNumber prop to get the next n movies
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
      // eslint-disable-next-line react/prop-types
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
  downloads: PropTypes.array,
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
