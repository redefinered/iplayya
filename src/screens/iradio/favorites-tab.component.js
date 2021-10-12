import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, FlatList } from 'react-native';
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
  selectFavoritesPaginator,
  selectRadioStations,
  selectPaginator
} from 'modules/ducks/iradio/iradio.selectors';

import Spacer from 'components/spacer.component';
import ContentWrap from 'components/content-wrap.component';
import RadioButton from 'components/radio-button/radio-button.component';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';

const ITEM_HEIGHT = 16;

const FavoritesTab = ({
  theme,
  // radioStations,
  favorites,
  favoritesPaginator,
  getFavoritesAction,
  getRadioStationsAction,
  removedFromFavorites,
  removeFromFavoritesAction,
  handleSelectItem,
  navigation,
  setIndex,
  resetFavoritesPaginatorAction
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  React.useEffect(() => {
    resetFavoritesPaginatorAction();
    // getFavoritesAction(favoritesPaginator);
  }, []);

  // React.useEffect(() => {
  //   if (favoritesPaginator.pageNumber === 1) {
  //     getFavoritesAction({ limit: 10, pageNumber: 2, orderBy: 'number', order: 'asc' });
  //   }
  // }, [favoritesPaginator]);

  // get favorites on mount
  React.useEffect(() => {
    resetFavoritesPaginatorAction();
    if (removedFromFavorites) {
      setActivateCheckboxes(false);
      getFavoritesAction({ pageNumber: 1, orderBy: 'number', order: 'asc' });
      getRadioStationsAction({ pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
  }, [removedFromFavorites]);

  console.log(favorites);
  // setup favorites
  React.useEffect(() => {
    if (favorites) {
      let data = favorites.map(({ id, name, cmd, number }) => ({
        id,
        name,
        cmd,
        number
      }));
      setListData(data);
    }
  }, [favorites]);

  const handleSelectItems = ({ id, cmd, name, number }) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === id);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([id, ...selectedItems]);
      }
    } else {
      handleSelectItem({ number, cmd, name });
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
      console.log(collection);
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

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      getFavoritesAction(favoritesPaginator);
      setOnEndReachedCalledDuringMomentum(true);
    }
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

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, cmd, name, number } }) => {
    return (
      <Pressable
        delayLongPress={1500}
        underlayColor={theme.iplayya.colors.black80}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent',
            paddingHorizontal: theme.spacing(2),
            paddingVertical: theme.spacing(2)
          }
        ]}
        onLongPress={() => handleLongPress(id)}
        onPress={() => handleSelectItems({ id, name, cmd, number })}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
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
          {activateCheckboxes && (
            <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
          )}
        </View>
      </Pressable>
    );
  };

  if (listData.length || favorites.length)
    return (
      <View style={{ flex: 1 }}>
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
        <FlatList
          data={listData}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index
          })}
          onEndReached={() => handleEndReached()}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
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
      </View>
    );
  return <EmptyState theme={theme} navigation={navigation} />;
};

FavoritesTab.propTypes = {
  theme: PropTypes.object,
  radioStations: PropTypes.array,
  favorites: PropTypes.array,
  favoritesPaginator: PropTypes.object,
  removedFromFavorites: PropTypes.bool,
  getFavorites: PropTypes.func,
  removeFromFavoritesAction: PropTypes.func,
  resetFavoritesPaginatorAction: PropTypes.func,
  getRadioStationsAction: PropTypes.func,
  getFavoritesAction: PropTypes.func,
  handleSelectItem: PropTypes.func,
  navigation: PropTypes.object,
  setIndex: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations,
  paginator: selectPaginator,
  favorites: selectFavorites,
  favoritesPaginator: selectFavoritesPaginator,
  removedFromFavorites: selectRemovedFromFavorites
});

const actions = {
  getFavoritesAction: Creators.getFavorites,
  getRadioStationsAction: Creators.get,
  removeFromFavoritesAction: Creators.removeFromFavorites,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator
};

export default compose(connect(mapStateToProps, actions), withTheme)(FavoritesTab);
