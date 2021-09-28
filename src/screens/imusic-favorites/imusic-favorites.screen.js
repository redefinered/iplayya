/* eslint-disable react/prop-types */

import React from 'react';
import { FlatList, View, Image } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import { createStructuredSelector } from 'reselect';
import { selectFavorites } from 'modules/ducks/imusic-favorites/imusic-favorites.selectors';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withLoader from 'components/with-loader.component';
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const ImusicFavorites = ({ favorites }) => {
  const handleSelectItem = () => {
    console.log('an item is selected');
  };

  const renderItem = ({ item: { name, ...rest } }) => (
    <TouchableRipple onPress={() => handleSelectItem({ ...rest, name })}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: theme.spacing(2),
          paddingVertical: theme.spacing(1)
        }}
      >
        <Image source={coverplaceholder} style={{ width: 40, height: 40 }} />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: 3,
            paddingLeft: theme.spacing(1),
            paddingRight: 5
          }}
        >
          <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 14 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.iplayya.colors.white50 }}>
            {`${rest.performer} • 4:04 min`}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );

  return (
    <View>
      <FlatList data={favorites} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const mapStateToProps = createStructuredSelector({ favorites: selectFavorites });

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImusicFavorites {...props} />
  </ScreenContainer>
);

const enhance = compose(connect(mapStateToProps, null), withLoader);

export default enhance(Container);
