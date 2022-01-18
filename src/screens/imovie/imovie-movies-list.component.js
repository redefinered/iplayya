import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react';
import CategoryScroll from 'components/category-scroll/category-scroll.component';
import theme, { brand } from 'common/theme';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const MoviesList = ({ isFetching, getMoviesAction, paginatorInfo, categoryPaginator, movies }) => {
  const list = React.useRef(null);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  const handleCategoryOnLayout = ({ nativeEvent }) => {
    console.log({ l: nativeEvent.layout });
  };

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      setOnEndReachedCalledDuringMomentum(true);

      if (isFetching) return; /// stop if another request is running

      getMoviesAction(paginatorInfo, categoryPaginator);
    }
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { category } }) => {
    if (typeof movies === 'undefined') return;

    return <CategoryScroll handleOnLayout={handleCategoryOnLayout} category={category} />;
  };

  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: brand.white10,
            borderRadius: 8,
            justifyContent: 'center',
            marginLeft: theme.spacing(2)
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
      ref={list}
      data={movies}
      showsVerticalScrollIndicator={false}
      keyExtractor={(movie) => movie.category}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      ListFooterComponent={renderListFooter()}
    />
  );
};

MoviesList.propTypes = {
  isFetching: PropTypes.bool,
  getMoviesAction: PropTypes.func,
  movies: PropTypes.array,
  categoryPaginator: PropTypes.array,
  paginatorInfo: PropTypes.array
};

export default MoviesList;
