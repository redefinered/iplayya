import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Text, withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectPaginator,
  selectFavorites,
  selectRemoved,
  selectAddedToFavorites
} from 'modules/ducks/iradio-favorites/iradio-favorites.selectors';
import Spacer from 'components/spacer.component';
import ContentWrap from 'components/content-wrap.component';
import RadioButton from 'components/radio-button/radio-button.component';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';
import { selectIsFetching } from 'modules/ducks/iradio-favorites/iradio-favorites.selectors';

const ITEM_HEIGHT = 16;

const FavoritesTab = ({
  theme,
  isFetching,
  favorites,
  paginator,
  removeFromFavoritesAction,
  handleSelectItem,
  navigation,
  setIndex,
  resetPaginatorAction,
  getFavoritesAction,
  removed
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  // const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
  //   true
  // );

  React.useEffect(() => {
    resetPaginatorAction();
    // getFavoritesAction(favoritesPaginator);
  }, []);

  React.useEffect(() => {
    if (removed) {
      setActivateCheckboxes(false);

      const prevPaginator = Object.assign(paginator, { pageNumber: paginator.pageNumber - 1 });
      // console.log({ prevPaginator });
      getFavoritesAction(prevPaginator);
    }
  }, [removed]);

  // setup favorites
  React.useEffect(() => {
    console.log({ x: favorites });
    if (favorites) {
      setListData(favorites);
    }
  }, [favorites]);

  const handleSelectItems = (item) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex(({ id }) => id === item.id);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([item, ...selectedItems]);
      }
    } else {
      handleSelectItem(item);
    }
  };

  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      setSelectedItems(listData);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  // console.log({ selectedItems });

  const handleSelectAll = () => {
    setSellectAll(!selectAll);
  };

  const handleLongPress = (item) => {
    setSelectedItems([item]);
    setActivateCheckboxes(true);
  };

  console.log({ selectedItems });

  const handleRemoveItems = () => {
    if (selectedItems.length) {
      removeFromFavoritesAction(selectedItems);
    }
  };

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  const handleEndReached = () => {
    getFavoritesAction(paginator);

    // if (!onEndReachedCalledDuringMomentum) {
    //   setOnEndReachedCalledDuringMomentum(true);
    // }
  };

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
  const renderItem = ({ item }) => {
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
        onLongPress={() => handleLongPress(item)}
        onPress={() => handleSelectItems(item)}
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
              {/* eslint-disable-next-line react/prop-types */}
              {item.number}
            </Text>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
                {/* eslint-disable-next-line react/prop-types */}
                {item.name}
              </Text>
            </View>
          </View>
          {activateCheckboxes && (
            <RadioButton selected={selectedItems.findIndex((i) => i === item) >= 0} />
          )}
        </View>
      </Pressable>
    );
  };

  const renderFavoriteLoader = () => {
    if (!isFetching) return;

    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          // backgroundColor: theme.iplayya.colors.black80,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (listData.length || favorites.length)
    return (
      <View style={{ flex: 1 }}>
        {renderFavoriteLoader()}
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
          // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          // eslint-disable-next-line react/prop-types
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
  isFetching: PropTypes.bool,
  favorites: PropTypes.array,
  addedToFavorites: PropTypes.array,
  paginator: PropTypes.object,
  removed: PropTypes.bool,
  removeFromFavoritesAction: PropTypes.func,
  resetPaginatorAction: PropTypes.func,
  handleSelectItem: PropTypes.func,
  navigation: PropTypes.object,
  setIndex: PropTypes.func,
  getFavoritesAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  paginator: selectPaginator,
  favorites: selectFavorites,
  removed: selectRemoved,
  addedToFavorites: selectAddedToFavorites,
  isFetching: selectIsFetching
});

const actions = {
  getFavoritesAction: Creators.getFavorites,
  removeFromFavoritesAction: Creators.removeFromFavorites,
  resetPaginatorAction: Creators.resetPaginator
};

export default compose(connect(mapStateToProps, actions), withTheme)(FavoritesTab);
