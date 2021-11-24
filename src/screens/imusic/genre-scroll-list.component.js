/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, FlatList, View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError } from 'modules/ducks/music/music.selectors';
import { Creators } from 'modules/ducks/music/music.actions';
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const SPACING_FOR_CARD_INSET = theme.spacing(2);
const CARD_DIMENSIONS = { WIDTH: 148, HEIGHT: 148 };

const GenreScrollList = ({
  data,
  onSelect,
  isFetching,
  paginatorOfGenre,
  getAlbumsByGenresAction
}) => {
  const brand = theme.iplayya.colors;

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

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

  // eslint-disable-next-line react/prop-types
  const renderThumbnail = ({ cover, name, performer }) => {
    if (!cover) {
      return (
        <React.Fragment>
          <View
            style={{
              width: CARD_DIMENSIONS.WIDTH,
              height: CARD_DIMENSIONS.HEIGHT,
              backgroundColor: brand.white10,
              borderRadius: 8,
              padding: 10,
              marginBottom: theme.spacing(1)
            }}
          >
            <Text style={{ fontSize: 16, color: brand.vibrantpussy }}>{name}</Text>
          </View>
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
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 12, maxWidth: 148, color: theme.iplayya.colors.white50 }}
          >
            {performer}
          </Text>
        </React.Fragment>
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
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 12, maxWidth: 148, color: theme.iplayya.colors.white50 }}
        >
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
    if (!onEndReachedCalledDuringMomentum) {
      // set pageNumber prop to get the next n albums
      if (typeof paginatorOfGenre === 'undefined') return;
      const { paginator } = paginatorOfGenre;
      getAlbumsByGenresAction(paginator);

      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  return (
    <FlatList
      data={data}
      showsHorizontalScrollIndicator={false}
      horizontal
      bounces={false}
      snapToInterval={CARD_DIMENSIONS.WIDTH + 10}
      snapToAlignment="start"
      contentInset={{
        top: 0,
        bottom: 0
      }}
      contentContainerStyle={{
        // contentInset alternative for Android
        paddingHorizontal: SPACING_FOR_CARD_INSET
      }}
      renderItem={renderItem}
      // eslint-disable-next-line react/prop-types
      keyExtractor={(item) => item.id}
      onEndReached={() => handleOnEndReached()}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      ListFooterComponent={renderListFooter()}
    />
  );
};

GenreScrollList.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  data: PropTypes.array,
  onSelect: PropTypes.func,
  paginatorOfGenre: PropTypes.object,
  getAlbumsByGenresAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching,
  error: selectError
});

const actions = {
  getAlbumsByGenresAction: Creators.getAlbumsByGenres
};

export default connect(mapStateToProps, actions)(GenreScrollList);
