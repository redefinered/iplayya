/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, FlatList, TextInput as FormInput } from 'react-native';
import { Text, withTheme, TextInput as RNPTextInput, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import TextInput from 'components/text-input/text-input.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import RadioButton from 'components/radio-button/radio-button.component';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';
import AlertModal from 'components/alert-modal/alert-modal.component';
import {
  selectError,
  selectFavorites,
  selectPaginator,
  selectIsFetching,
  selectIsSearching,
  selectFavoritesPaginator,
  selectfavoritesListRemoveUpdated
} from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';

const ITEM_HEIGHT = 84;
const channelplaceholder = require('assets/channel-placeholder.png');

const ItvFavoritesScreen = ({
  theme,
  route,
  isFetching,
  paginator,
  favorites,
  navigation,
  isSearching,
  favoritesRemoved,
  favoritesPaginator,
  getChannelsAction,
  getFavoritesAction,
  resetPaginatorAction,
  removeFromFavoritesAction,
  getChannelsByCategoriesAction,
  resetFavoritesPaginatorAction
}) => {
  const updated = React.useRef(false);

  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    resetFavoritesPaginatorAction();

    const subscribeToViewRemove = navigation.addListener('beforeRemove', () => {
      if (updated.current) {
        const { selectedCategory } = route.params;

        if (selectedCategory !== 'all') {
          getChannelsByCategoriesAction({
            categories: [parseInt(selectedCategory)],
            ...Object.assign(paginator, { pageNumber: 1 })
          });
        } else {
          getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
        }
      }
    });

    return subscribeToViewRemove;
  }, []);

  React.useEffect(() => {
    if (searchTerm) {
      const d = favorites.filter(({ title }) => title.toLowerCase().includes(searchTerm));
      return setData(d);
    }

    setData(favorites);
  }, [favorites, searchTerm]);

  // console.log({ favorites, searchTerm });

  React.useEffect(() => {
    if (favoritesPaginator.pageNumber === 1) {
      getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
    }
  }, [favoritesPaginator]);

  React.useEffect(() => {
    if (favoritesRemoved) {
      resetPaginatorAction();

      updated.current = true;
      setActivateCheckboxes(false);

      getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
    } else {
      updated.current = false;
    }
  }, [favoritesRemoved]);

  const handleItemPress = (item) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === item.id);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([item.id, ...selectedItems]);
      }
    } else {
      // navigation.navigate('MovieDetailScreen', { videoId: item });
      navigation.navigate('ItvChannelDetailScreen', { channelId: item });
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
    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  const handleChange = (term) => {
    setSearchTerm(term);
  };

  const renderSearchBar = () => {
    if (isSearching)
      return (
        <ContentWrap>
          <TextInput
            multiline={false}
            name="search"
            handleChangeText={(term) => handleChange(term)}
            returnKeyType="search"
            autoFocus
            autoCapitalize="none"
            clearButtonMode="while-editing"
            autoCompleteType="email"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
            placeholder="Search a favorite"
            render={(props) => (
              <FormInput
                {...props}
                style={{
                  flex: 1,
                  marginLeft: 40,
                  fontSize: 16,
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              />
            )}
            left={
              <RNPTextInput.Icon
                name={() => (
                  <Icon name="search" size={theme.iconSize(4)} style={{ marginRight: 5 }} />
                )}
              />
            }
          />
        </ContentWrap>
      );
  };

  const getDeleteAlertMessage = () => {
    if (selectedItems.length === favorites.length)
      return 'Are you sure you want to delete this channel/s from your Favorites list?';

    if (selectedItems.length > 1)
      return 'Are you sure you want to delete this channel/s from your Favorites list?';

    return 'Are you sure you want to delete this channel/s from your Favorites list?';
  };

  if (data.length)
    return (
      <View style={{ marginTop: theme.spacing(3) }}>
        {isFetching && (
          <View style={{ height: ITEM_HEIGHT - theme.spacing(3) }}>
            <ActivityIndicator />
          </View>
        )}

        {activateCheckboxes && (
          <ContentWrap>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing(2)
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
          </ContentWrap>
        )}

        {renderSearchBar()}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItemChanel
              full
              showepg={false}
              showFavoriteButton={false}
              item={item}
              activateCheckboxes={activateCheckboxes}
              selected={typeof selectedItems.find((i) => i === item.id) !== 'undefined'}
              isCatchUpAvailable={false}
              thumbnail={channelplaceholder}
              handleItemPress={handleItemPress}
              handleLongPress={handleLongPress}
            />
          )}
        />
        {showDeleteConfirmation && (
          <AlertModal
            variant="confirmation"
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

  return <EmptyState isFetching={isFetching} theme={theme} navigation={navigation} />;
};

const EmptyState = ({ isFetching, theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    {isFetching && (
      <View style={{ height: ITEM_HEIGHT - theme.spacing(3) }}>
        <ActivityIndicator />
      </View>
    )}
    <NoFavorites />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No favorites yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ItvScreen', { openItvGuide: false })}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Heart a channel to add in your Favorites list.
      </Text>
    </Pressable>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ItvFavoritesScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  favoritesPaginator: selectFavoritesPaginator,
  favoritesRemoved: selectfavoritesListRemoveUpdated,
  paginator: selectPaginator,
  isSearching: selectIsSearching
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavorites,
  getChannelsAction: Creators.getChannels,
  getChannelsStartAction: Creators.getChannelsStart,
  resetPaginatorAction: Creators.resetPaginator,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator
};

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(Container);
