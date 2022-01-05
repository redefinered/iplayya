import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import SnackBar from 'components/snackbar/snackbar.component';
import { createFontFormat } from 'utils';
import FavoriteButton from 'components/button-favorite/favorite-button.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectRadioStations, selectPaginator } from 'modules/ducks/iradio/iradio.selectors';
import {
  selectIsFetching,
  selectAdded
} from 'modules/ducks/iradio-favorites/iradio-favorites.selectors';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import ContentWrap from 'components/content-wrap.component';
import { useMutation } from '@apollo/client';
import { ADD_RADIO_TO_FAVORITES } from 'graphql/radios.graphql';

const ITEM_HEIGHT = 44;

const RadioStationsTab = ({
  getRadioStationsAction,
  radioStations,
  paginator,
  handleSelectItem,
  isAddingToFavorites,
  // addToFavoritesAction,
  added,
  resetUpdateIndicatorsAction,
  getFavoritesAction
}) => {
  const [showSnackBar, setShowSnackBar] = React.useState(false);

  React.useEffect(() => {
    if (added) setShowSnackBar(true);
    const prevPaginator = Object.assign(paginator, { pageNumber: paginator.pageNumber - 1 });
    getFavoritesAction(prevPaginator);
  }, [added]);

  React.useEffect(() => {
    if (!showSnackBar) resetUpdateIndicatorsAction();
  }, [showSnackBar]);

  const handleEndReached = () => {
    getRadioStationsAction(paginator);
  };

  // eslint-disable-next-line no-unused-vars
  const [addToFavorites, { data, loading, error }] = useMutation(ADD_RADIO_TO_FAVORITES, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          favoriteRadios: (previous = [], { toReference }) => {
            return [...previous, toReference(data.addRadioToFavorites)];
          },
          radios: (previous = [], { toReference }) => {
            return [...previous, toReference(data.addRadioToFavorites)];
          }
        }
      });
    }
  });

  const handleAddToFavorites = (item) => {
    // eslint-disable-next-line no-unused-vars
    const { is_favorite, number, __typename, monitoring_status_updated, c, ...rest } = item;

    const reqInput = {
      is_favorite,
      number: parseInt(number),
      monitoring_status_updated: monitoring_status_updated || '0',
      ...rest
    };

    // stop if alreay in favorites
    if (is_favorite) return;

    setShowSnackBar(true);
    // exec add to favorites
    // addToFavoritesAction(reqInput);
    addToFavorites({ variables: { input: reqInput } });
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item }) => {
    // eslint-disable-next-line react/prop-types
    const { name, number } = item;
    return (
      <Pressable
        onPress={() => handleSelectItem(item)}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent'
          }
        ]}
      >
        <ContentWrap
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
            // padding: theme.spacing(2)
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Text numberOfLines={1} style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
              {number}
            </Text>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
                {name}
              </Text>
            </View>
          </View>
          <FavoriteButton item={item} pressAction={handleAddToFavorites} />
        </ContentWrap>
      </Pressable>
    );
  };

  const renderFavoriteLoader = () => {
    if (!isAddingToFavorites) return;

    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          // backgroundColor: theme.iplayya.colors.black80,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderFavoriteLoader()}
      <FlatList
        data={radioStations}
        // eslint-disable-next-line react/prop-types
        keyExtractor={(item) => item.id}
        onEndReached={() => handleEndReached()}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        getItemLayout={(data, index) => {
          return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
        }}
      />
      <SnackBar
        visible={showSnackBar}
        message="Station is added to your favorites list"
        iconName="heart-solid"
        iconColor="#FF5050"
      />
    </View>
  );
};

RadioStationsTab.propTypes = {
  theme: PropTypes.object,
  added: PropTypes.bool,
  isAddingToFavorites: PropTypes.bool,
  getRadioStationsAction: PropTypes.func,
  radioStations: PropTypes.array,
  addToFavoritesAction: PropTypes.func,
  getFavoritesAction: PropTypes.func,
  handleSelectItem: PropTypes.func,
  resetUpdateIndicatorsAction: PropTypes.func,
  paginator: PropTypes.object
};

const actions = {
  getRadioStationsAction: Creators.get,
  getFavoritesAction: FavoritesCreators.getFavorites,
  addToFavoritesAction: FavoritesCreators.addToFavorites,
  resetUpdateIndicatorsAction: FavoritesCreators.resetUpdateIndicators
};

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations,
  paginator: selectPaginator,
  isAddingToFavorites: selectIsFetching,
  added: selectAdded
});

export default compose(connect(mapStateToProps, actions), withTheme)(RadioStationsTab);
