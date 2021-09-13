/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
// import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ScreenContainer from 'components/screen-container.component';
// import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
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
  selectFavoritesPaginator,
  selectFavoritesListRemoveUpdated,
  selectPaginator
} from 'modules/ducks/isports/isports.selectors';
import { urlEncodeTitle, createFontFormat } from 'utils';
import { Creators } from 'modules/ducks/isports/isports.actions';
import moment from 'moment';

const IsportsFavoritesScreen = ({
  theme,
  navigation,
  favorites,
  getChannelsAction,
  getFavoritesAction,
  removeFromFavoritesAction,
  favoritesPaginator,
  favoriteListsRemoveUpdated,

  resetFavoritesPaginatorAction
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    resetFavoritesPaginatorAction();
  }, []);

  React.useEffect(() => {
    if (favoritesPaginator.pageNumber === 1) {
      getFavoritesAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
  }, [favoritesPaginator]);

  // setup channels data
  React.useEffect(() => {
    if (favorites) {
      let data = favorites.map(({ id, title, number }) => ({
        id,
        title,
        number,
        thumbnail: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(title)}`
      }));
      setListData(data);
    }
  }, [favorites]);

  React.useEffect(() => {
    if (favoriteListsRemoveUpdated) {
      setActivateCheckboxes(false);
      getFavoritesAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
      getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
  }, [favoriteListsRemoveUpdated]);

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

  if (listData.length || favorites.length)
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

            {/* <Spacer size={30} /> */}
          </ContentWrap>
        )}

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
                            navigation.navigate('ProgramGuideScreen', { channelId: id })
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

        {/* <View style={{ marginTop: 30 }}>
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
        </View> */}
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
    <Pressable onPress={() => navigation.navigate('IsportsScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Heart a channel to add to your Favorites list.
      </Text>
    </Pressable>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IsportsFavoritesScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  paginatorInfo: selectPaginatorInfo,
  favorites: selectFavorites,
  favoritesPaginator: selectFavoritesPaginator,
  favoriteListsRemoveUpdated: selectFavoritesListRemoveUpdated,
  paginator: selectPaginator
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavorites,
  getChannelsAction: Creators.getChannels,
  getChannelsStartAction: Creators.getChannelsStart,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator,
  favoritesStartAction: Creators.favoritesStart
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
