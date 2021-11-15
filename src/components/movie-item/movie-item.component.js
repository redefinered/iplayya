import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import theme from 'common/theme';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const MovieItem = ({ item, onSelect }) => {
  const { id, is_series, thumbnail: thumbnailUrl, title } = item;

  const renderContent = () => {
    if (!thumbnailUrl) {
      return (
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: theme.iplayya.colors.white10,
            borderRadius: 8,
            padding: theme.spacing(1)
          }}
        >
          <Text style={{ fontSize: 16, color: theme.iplayya.colors.vibrantpussy }}>{title}</Text>
        </View>
      );
    }
    return (
      <Image
        style={{ width: CARD_DIMENSIONS.WIDTH, height: CARD_DIMENSIONS.HEIGHT, borderRadius: 8 }}
        source={{ thumbnailUrl }}
      />
    );
  };

  return (
    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onSelect({ id, is_series })}>
      {renderContent()}
    </TouchableOpacity>
  );
};

MovieItem.propTypes = {
  item: PropTypes.object,
  onSelect: PropTypes.func
};

export default MovieItem;
