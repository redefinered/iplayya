import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, Image, FlatList, ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError } from 'modules/ducks/movies/movies.selectors';
import { Creators } from 'modules/ducks/movies/movies.actions';

const CategoryScrollList = ({
  isFetching,
  data,
  onSelect,
  getMoviesByCategoriesAction,
  paginatorOfCategory
}) => {
  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, thumbnail: url } }) => (
    <Pressable style={{ marginRight: 10 }} onPress={() => onSelect(id)}>
      <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
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
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onRefresh={() => console.log('refreshing')}
      refreshing={isFetching}
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
