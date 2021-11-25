/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
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
  selectFavorites,
  selectError,
  selectIsFetching,
  selectFavoritesPaginator,
  selectPaginator,
  selectChannels,
  selectfavoritesListRemoveUpdated
} from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';

const channelplaceholder = require('assets/channel-placeholder.png');
import moment from 'moment';

const ItvFavoritesScreen = ({
  theme,
  navigation,
  favorites,
  getFavoritesAction,
  paginator,
  favoritesPaginator,
  favoritesRemoved,
  removeFromFavoritesAction,
  getChannelsAction,
  resetPaginatorAction,
  resetFavoritesPaginatorAction,
  favoritesStartAction
}) => {
  const updated = React.useRef(false);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  // const [data, setListData] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    // call start action to reset update checkers
    favoritesStartAction();

    resetFavoritesPaginatorAction();

    const subscribeToViewRemove = navigation.addListener('beforeRemove', () => {
      if (updated.current) getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
    });

    return subscribeToViewRemove;
  }, []);

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

      // get favorites when favorites list is updated
      /// TODO: troubleshoot why cache is not updated even after refetching from removeFavorites mutation
      /// TODO: troubleshoot why cache is not updated even after refetching from removeFavorites mutation
      /// TODO: troubleshoot why cache is not updated even after refetching from removeFavorites mutation
      getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
    } else {
      updated.current = false;
    }
  }, [favoritesRemoved]);

  // setup channels data
  // React.useEffect(() => {
  //   if (favorites) {
  //     let data = favorites.map(({ id, title, ...rest }) => ({
  //       id,
  //       title,
  //       thumbnail: channelplaceholder,
  //       ...rest
  //     }));
  //     setListData(data);
  //   }
  // }, [favorites]);

  const handleItemPress = (item) => {
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
    // do delete action here
    // console.log('delete action');
    // setShowDeleteConfirmation(false);

    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  // const handleEndReached = () => {
  //   console.log({ favoritesPaginator });
  //   if (!onEndReachedCalledDuringMomentum) {
  //     getFavoritesAction(favoritesPaginator);
  //     setOnEndReachedCalledDuringMomentum(true);
  //   }
  // };

  const getDeleteAlertMessage = () => {
    if (selectedItems.length === favorites.length)
      return 'Are you sure you want to delete this channel/s from your Favorites list?';

    if (selectedItems.length > 1)
      return 'Are you sure you want to delete this channel/s from your Favorites list?';

    return 'Are you sure you want to delete this channel/s from your Favorites list?';
  };

  if (favorites.length)
    return (
      <View style={{ marginTop: 20 }}>
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
          </ContentWrap>
        )}

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItemChanel
              full
              showipg={false}
              item={item}
              isCatchUpAvailable={false}
              thumbnail={channelplaceholder}
              handleItemPress={handleItemPress}
            />
          )}
        />
        {/* <FlatList data={favorites} keyExtractor={(id) => item.id} /> */}
        {listData.map(({ id, title, epgtitle, number, time, time_to }) => {
          const getSchedule = (time, time_to) => {
            if (!time || !time_to) return;

            return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
          };
          return (
            <Pressable
              key={id}
              underlayColor={theme.iplayya.colors.black80}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent'
                  // flexDirection: 'row',
                  // alignItems: 'center',
                  // justifyContent: 'space-between',
                  // marginBottom: 5,
                }
              ]}
              onLongPress={() => handleLongPress(id)}
              onPress={() => handleSelectItem(id)}
            >
              <ContentWrap
                style={{
                  marginTop: 10,
                  position: 'relative',
                  height: 80,
                  paddingLeft: 75
                }}
              >
                {/* <Image
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    position: 'absolute',
                    top: 2,
                    left: 10
                  }}
                  source={channelplaceholder}
                /> */}
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    marginRight: 10,
                    backgroundColor: theme.iplayya.colors.white10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 2,
                    left: 10
                  }}
                >
                  <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 3,
                    marginLeft: 5
                  }}
                >
                  <View style={{ justifyContent: 'center' }}>
                    <View>
                      <Text
                        style={{
                          fontWeight: '700',
                          ...createFontFormat(12, 16),
                          marginBottom: 5,
                          color: theme.iplayya.colors.white50
                        }}
                      >
                        {`${number}: ${title}`}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '700',
                          ...createFontFormat(12, 16),
                          color: theme.iplayya.colors.white80,
                          marginBottom: 5
                        }}
                      >
                        {epgtitle}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '75%'
                      }}
                    >
                      <Text
                        style={{
                          ...createFontFormat(12, 16),
                          color: theme.iplayya.colors.white50,
                          marginBottom: 5
                        }}
                      >
                        {getSchedule(time, time_to)}
                      </Text>

                      {!activateCheckboxes && (
                        <Pressable
                          underlayColor={theme.iplayya.colors.black80}
                          onPress={() =>
                            navigation.navigate('ItvProgramGuideScreen', { channelId: id })
                          }
                          style={({ pressed }) => [
                            {
                              backgroundColor: pressed
                                ? theme.iplayya.colors.black80
                                : 'transparent',
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }
                          ]}
                        >
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 12,
                              color: theme.iplayya.colors.white50
                            }}
                          >
                            EPG
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                  {activateCheckboxes && (
                    <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                  )}
                </View>
              </ContentWrap>
            </Pressable>
          );
        })}
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
  channels: selectChannels
});

const actions = {
  favoritesStartAction: Creators.favoritesStart,
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavorites,
  getChannelsAction: Creators.getChannels,
  getChannelsStartAction: Creators.getChannelsStart,
  resetPaginatorAction: Creators.resetPaginator,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator
};

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(Container);
