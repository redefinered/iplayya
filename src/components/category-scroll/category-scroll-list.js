import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, Image, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError } from 'modules/ducks/movies/movies.selectors';
import { Creators } from 'modules/ducks/movies/movies.actions';

const CARD_WIDTH = 115;
const CARD_HEIGHT = 170;
const SPACING_FOR_CARD_INSET = 15;

const CategoryScrollList = ({
  data,
  onSelect,
  getMoviesByCategoriesAction,
  paginatorOfCategory
}) => {
  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, thumbnail: url } }) => (
    <Pressable style={{ marginRight: 10 }} onPress={() => onSelect(id)}>
      <Image style={{ width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 8 }} source={{ url }} />
    </Pressable>
  );

  // console.log({ paginatorOfCategory });

  const handleOnEndReached = () => {
    // set pageNumber prop to get the next n movies
    console.log('end');
    const { paginator } = paginatorOfCategory;
    getMoviesByCategoriesAction(paginator);
  };

  return (
    <FlatList
      data={data}
      horizontal
      decelerationRate={0}
      snapToInterval={CARD_WIDTH + 10}
      snapToAlignment="start"
      contentInset={{
        top: 0,
        left: SPACING_FOR_CARD_INSET,
        bottom: 0,
        right: SPACING_FOR_CARD_INSET
      }}
      contentContainerStyle={{
        // contentInset alternative for Android
        paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0 // Horizontal spacing before and after the ScrollView
      }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={{ paddingHorizontal: 10 }}
      onEndReached={() => handleOnEndReached()}
      onEndReachedThreshold={0}
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

export default connect(mapStateToProps, actions)(CategoryScrollList);
