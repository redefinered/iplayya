import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
// import SnackBar from 'components/snackbar/snackbar.component';
import Icon from 'components/icon/icon.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectFavorites,
  selectRemovedFromFavorites,
  selectPaginatorInfo
} from 'modules/ducks/iradio/iradio.selectors';
import { selectRadioStations } from 'modules/ducks/iradio/iradio.selectors';

import Spacer from 'components/spacer.component';
import ContentWrap from 'components/content-wrap.component';
import RadioButton from 'components/radio-button/radio-button.component';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';

const FavoritesTab = ({
  theme,
  // radioStations,
  favorites,
  paginatorInfo,
  getFavoritesAction,
  removedFromFavorites,
  removeFromFavoritesAction,
  // handleSelectItem,
  navigation,
  setIndex
}) => {
  // const [showSnackBar, setShowSnackBar] = React.useState(false);
  // const [showConfirm, setShowConfirm] = React.useState(false);
  // const [removedItemName, setRemovedItemName] = React.useState('');
  // const [selectedIdToRemove, serSelectedIdToremove] = React.useState(null);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);

  // const handleRemovePressed = (id) => {
  //   serSelectedIdToremove(id);
  //   setShowConfirm(true);
  // };

  // const confirmRemove = (id) => {
  //   // add channel to favorites
  //   removeFromFavoritesAction(id);

  //   setShowConfirm(false);
  // };

  // get favorites on mount
  React.useEffect(() => {
    getFavoritesAction(paginatorInfo);
  }, []);

  React.useEffect(() => {
    if (removedFromFavorites) {
      // const name = radioStations.find(({ id }) => id === removedFromFavorites).name;
      // setRemovedItemName(name);
      // setShowSnackBar(true);
      getFavoritesAction(paginatorInfo);
    }
  }, [removedFromFavorites]);

  // const hideSnackBar = () => {
  //   setTimeout(() => {
  //     setShowSnackBar(false);
  //   }, 3000);
  // };

  const handleSelectItem = (item) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === item);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([item, ...selectedItems]);
      }
    } else {
      // navigation.navigate('MovieDetailScreen', { videoId: item });
      navigation.navigate('IsportsChannelDetailScreen', { channelId: item });
    }
  };

  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      let collection = favorites.map(({ id }) => {
        return id;
      });
      setSelectedItems(collection);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  const handleSelectAll = () => {
    setSellectAll(!selectAll);
  };

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  const handleRemoveItems = () => {
    if (selectedItems.length) {
      let deleteItems = selectedItems.map((id) => parseInt(id));
      removeFromFavoritesAction(deleteItems);
    }
  };

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    // do delete action here
    // console.log('delete action');
    // setShowDeleteConfirmation(false);
    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  // React.useEffect(() => {
  //   if (showSnackBar) hideSnackBar();
  // }, [showSnackBar]);

  const EmptyState = ({ theme }) => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingBottom: 100
      }}
    >
      <NoFavorites />
      <Spacer />
      <Text style={{ fontSize: 24 }}>No favorites yet</Text>
      <Spacer size={30} />
      <Pressable onPress={() => setIndex(0)}>
        <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
          Heart a station to add to your Favorites list.
        </Text>
      </Pressable>
    </View>
  );

  if (favorites.length)
    return (
      <ScrollView>
        {activateCheckboxes && (
          <ContentWrap>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Pressable
                onPress={() => setShowDeleteConfirmation(true)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5
                  }
                ]}
              >
                <Icon name="delete" size={theme.iconSize(3)} style={{ marginRight: 10 }} />
                <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSelectAll()}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ marginRight: 10 }}>All</Text>
                <RadioButton selected={selectedItems.length === favorites.length} />
              </Pressable>
            </View>

            <Spacer size={20} />
          </ContentWrap>
        )}
        {/* <AlertModal
          iconName="unfavorite"
          iconColor="#FF5050"
          confirmText="Remove"
          message="Do you want to remove this station to your Favorite list?"
          hideAction={() => setShowConfirm(false)}
          confirmAction={() => confirmRemove(selectedIdToRemove)}
          visible={showConfirm}
        /> */}
        {/* <SnackBar
          visible={showSnackBar}
          message={`${removedItemName} is removed to your favorites list`}
          iconName="heart-solid"
          iconColor="#FF5050"
        /> */}
        {favorites.map(({ id, name }) => (
          <Pressable
            key={id}
            underlayColor={theme.iplayya.colors.black80}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent',
                paddingHorizontal: theme.spacing(2),
                paddingVertical: theme.spacing(2)
              }
            ]}
            onLongPress={() => handleLongPress(id)}
            onPress={() => handleSelectItem(id)}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View>
                <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{name}</Text>
              </View>
              <View>
                {activateCheckboxes && (
                  <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                )}
              </View>
            </View>
          </Pressable>
        ))}
        {showDeleteConfirmation && (
          <AlertModal
            variant="confirmation"
            message={`Are you sure you want to delete ${
              selectedItems.length > 1 ? 'these' : 'this'
            } channel/s from your Favorites list?`}
            visible={showDeleteConfirmation}
            onCancel={handleHideConfirmDeleteModal}
            hideAction={handleHideConfirmDeleteModal}
            confirmText="Delete"
            confirmAction={handleConfirmDelete}
          />
        )}
      </ScrollView>
    );
  return <EmptyState theme={theme} navigation={navigation} />;
};

FavoritesTab.propTypes = {
  theme: PropTypes.object,
  radioStations: PropTypes.array,
  favorites: PropTypes.array,
  paginatorInfo: PropTypes.object,
  removedFromFavorites: PropTypes.bool,
  getFavorites: PropTypes.func,
  removeFromFavoritesAction: PropTypes.func,
  getFavoritesAction: PropTypes.func,
  // handleSelectItem: PropTypes.func,
  navigation: PropTypes.object,
  setIndex: PropTypes.func
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

{
  /* <TouchableRipple key={id} onPress={() => handleSelectItem({ id, name, ...rest })}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing(2)
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
            </View>
          </TouchableRipple> */
}
