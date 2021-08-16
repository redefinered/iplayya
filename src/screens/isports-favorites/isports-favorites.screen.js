/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ScreenContainer from 'components/screen-container.component';
// import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectPaginatorInfo } from 'modules/ducks/isports/isports.selectors';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';
import AlertModal from 'components/alert-modal/alert-modal.component';
import {
  selectFavorites,
  selectError,
  selectIsFetching,
  selectRemovedFromFavorites
} from 'modules/ducks/isports/isports.selectors';
import { urlEncodeTitle, createFontFormat } from 'utils';
import { Creators } from 'modules/ducks/isports/isports.actions';

const IsportsFavoritesScreen = ({
  theme,
  navigation,
  favorites,
  getChannelsAction,
  getFavoritesAction,
  removeFromFavoritesAction,
  removedFromFavorites
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    getFavoritesAction({ limit: 10, pageNumber: 1 });
  }, []);

  // setup channels data
  React.useEffect(() => {
    if (favorites.length) {
      let data = favorites.map(({ id, title }) => ({
        id,
        title,
        thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
      }));
      setListData(data);
    }
  }, [favorites]);

  React.useEffect(() => {
    if (removedFromFavorites) {
      getFavoritesAction({ limit: 10, pageNumber: 1 });
      getChannelsAction({ limit: 10, pageNumber: 1 });
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

  console.log({ selectedItems });

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

  if (listData.length)
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
                style={{ flexDirection: 'row', alignItems: 'center' }}
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

            <Spacer size={30} />
          </ContentWrap>
        )}

        <View style={{ marginTop: 30 }}>
          {listData.map(({ id, ...itemProps }) => (
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
              {...itemProps}
              full
            />
          ))}
        </View>
        {showDeleteConfirmation && (
          <AlertModal
            variant="danger"
            message={`Are you sure you want to delete ${
              selectedItems.length > 1 ? 'these' : 'this'
            } channel in your download list?`}
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
    <IsportsFavoritesScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  paginatorInfo: selectPaginatorInfo,
  favorites: selectFavorites,
  removedFromFavorites: selectRemovedFromFavorites
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavorites,
  getChannelsAction: Creators.getChannels
};

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(Container);
