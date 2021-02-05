import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import SnackBar from 'components/snackbar/snackbar.component';
import Icon from 'components/icon/icon.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/radios/radios.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectFavorites,
  selectRemovedFromFavorites,
  selectPaginatorInfo
} from 'modules/ducks/radios/radios.selectors';
import { selectRadioStations } from 'modules/ducks/radios/radios.selectors';

const FavoritesTab = ({
  theme,
  radioStations,
  favorites,
  paginatorInfo,
  getFavoritesAction,
  removedFromFavorites,
  removeFromFavoritesAction
}) => {
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [removedItemName, setRemovedItemName] = React.useState('');
  const [selectedIdToRemove, serSelectedIdToremove] = React.useState(null);

  const handleRemovePressed = (id) => {
    serSelectedIdToremove(id);
    setShowConfirm(true);
  };

  const confirmRemove = (id) => {
    // add channel to favorites
    removeFromFavoritesAction(id);

    setShowConfirm(false);
  };

  // get favorites on mount
  React.useEffect(() => {
    getFavoritesAction(paginatorInfo);
  }, []);

  React.useEffect(() => {
    if (removedFromFavorites) {
      const name = radioStations.find(({ id }) => id === removedFromFavorites).name;
      setRemovedItemName(name);
      setShowSnackBar(true);
      getFavoritesAction(paginatorInfo);
    }
  }, [removedFromFavorites]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  console.log({ removedFromFavorites });

  return (
    <React.Fragment>
      <AlertModal
        iconName="unfavorite"
        iconColor="#FF5050"
        confirmText="Remove"
        message="Do you want to remove this station to your Favorite list?"
        hideAction={() => setShowConfirm(false)}
        confirmAction={() => confirmRemove(selectedIdToRemove)}
        visible={showConfirm}
      />
      <SnackBar
        visible={showSnackBar}
        message={`${removedItemName} is removed to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
      {favorites.map(({ id, name }) => (
        <ContentWrap
          key={id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{name}</Text>
          </View>
          <View>
            <Pressable onPress={() => handleRemovePressed(id)}>
              <Icon
                name="heart-solid"
                size={24}
                style={{ color: theme.iplayya.colors.vibrantpussy }}
              />
            </Pressable>
          </View>
        </ContentWrap>
      ))}
    </React.Fragment>
  );
};

FavoritesTab.propTypes = {
  theme: PropTypes.object,
  radioStations: PropTypes.array,
  favorites: PropTypes.array,
  paginatorInfo: PropTypes.object,
  removedFromFavorites: PropTypes.string,
  getFavorites: PropTypes.func,
  removeFromFavoritesAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations,
  favorites: selectFavorites,
  paginatorInfo: selectPaginatorInfo,
  removedFromFavorites: selectRemovedFromFavorites
});

const actions = {
  getFavoritesAction: Creators.getFavorites,
  removeFromFavoritesAction: Creators.removeFromFavorites
};

export default compose(connect(mapStateToProps, actions), withTheme)(FavoritesTab);
