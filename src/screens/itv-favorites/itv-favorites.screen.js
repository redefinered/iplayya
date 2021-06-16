/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';
import AlertModal from 'components/alert-modal/alert-modal.component';
import {
  selectFavorites,
  selectError,
  selectIsFetching,
  selectRemovedFromFavorites,
  selectFavoritesPaginator
} from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';
import { selectFavoritesListUpdated } from 'modules/ducks/itv/itv.selectors';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvFavoritesScreen = ({
  theme,
  navigation,
  favorites,
  getFavoritesAction,
  favoritesPaginator,
  favoritesListUpdated,
  // getChannelsAction,
  removeFromFavoritesAction,
  removedFromFavorites,

  resetFavoritesPaginatorAction
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  React.useEffect(() => {
    resetFavoritesPaginatorAction();
  }, []);

  React.useEffect(() => {
    if (favoritesPaginator.pageNumber === 1) {
      getFavoritesAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
  }, [favoritesPaginator]);

  React.useEffect(() => {
    if (favoritesListUpdated) {
      setActivateCheckboxes(false);
      getFavoritesAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
  }, [favoritesListUpdated]);

  // setup channels data
  React.useEffect(() => {
    if (favorites.length) {
      let data = favorites.map(({ id, title, ...rest }) => ({
        id,
        title,
        thumbnail: channelplaceholder,
        ...rest
      }));
      setListData(data);
    }
  }, [favorites]);

  React.useEffect(() => {
    if (removedFromFavorites) {
      getFavoritesAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
      // getChannelsAction({ limit: 10, pageNumber: 1 });
      setSelectedItems([]);
    }
  }, [removedFromFavorites]);

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
      navigation.navigate('ChannelDetailScreen', { channelId: item });
    }
  };

  // hide checkboxes when there is no selected item
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

  // remove items form favorites
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
    console.log({ favoritesPaginator });
    if (!onEndReachedCalledDuringMomentum) {
      getFavoritesAction(favoritesPaginator);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  const getDeleteAlertMessage = () => {
    if (selectedItems.length === listData.length)
      return 'Are you sure you want to delete all channels from your favorites list?';

    if (selectedItems.length > 1)
      return 'Are you sure you want to delete these channels from your favorites list?';

    return 'Are you sure you want to delete this channel from your favorites list?';
  };

  if (listData.length)
    return (
      <View>
        {activateCheckboxes && (
          <ContentWrap style={{ marginTop: 30 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Pressable
                onPress={() => setShowDeleteConfirmation(true)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Icon name="delete" size={24} style={{ marginRight: 10 }} />
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
          </ContentWrap>
        )}

        <View style={{ paddingTop: theme.spacing(4) }}>
          <FlatList
            data={listData}
            keyExtractor={(item) => item.id}
            onEndReached={() => handleEndReached()}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            renderItem={({ item: { id, ...rest } }) => (
              <ListItemChanel
                id={id}
                handleLongPress={handleLongPress}
                onSelect={handleSelectItem}
                onRightActionPress={null}
                selected={selectedItems.findIndex((i) => i === id) >= 0}
                activateCheckboxes={activateCheckboxes}
                full
                {...rest}
              />
            )}
          />
          {/* {listData.map(({ id, ...rest }) => (
            <ListItemChanel
              key={id}
              id={id}
              handleLongPress={handleLongPress}
              onSelect={handleSelectItem}
              onRightActionPress={null}
              selected={selectedItems.findIndex((i) => i === id) >= 0}
              activateCheckboxes={activateCheckboxes}
              isFavorite={
                typeof favorites.find(({ id: fid }) => parseInt(fid) === id) !== 'undefined'
                  ? true
                  : false
              }
              {...rest}
              full
            />
          ))} */}
        </View>
        {showDeleteConfirmation && (
          <AlertModal
            variant="danger"
            message={getDeleteAlertMessage()}
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

const EmptyState = ({ theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    <NoFavorites />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No favorites yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Heart a channel to add to your favorites list.
      </Text>
    </Pressable>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <ItvFavoritesScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  favoritesPaginator: selectFavoritesPaginator,
  removedFromFavorites: selectRemovedFromFavorites,
  favoritesListUpdated: selectFavoritesListUpdated
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavorites,
  getChannelsAction: Creators.getChannels,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
