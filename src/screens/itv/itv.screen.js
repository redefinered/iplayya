/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo,
  selectGenres,
  selectChannels,
  selectAddedToFavorites,
  selectFavorites
} from 'modules/ducks/itv/itv.selectors';
import { urlEncodeTitle } from 'utils';
import Spacer from 'components/spacer.component';
import uniq from 'lodash/uniq';

const ItvScreen = ({
  isFetching,
  navigation,
  error,
  genres,
  channels,
  getGenresAction,
  getChannelsAction,
  paginatorInfo,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  addToFavoritesAction,
  isFavoritesUpdated,
  getFavoritesAction,
  route: { params }
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);

  // get genres on mount
  React.useEffect(() => {
    resetPaginatorAction(); // for debugging
    getGenresAction();
  }, []);

  React.useEffect(() => {
    if (typeof params !== 'undefined') {
      setSelectedCategory(params.genreId);
      getChannelsByCategoriesAction({ categories: [parseInt(params.genreId)] });
    }
  }, [params]);

  // setup genres data
  React.useEffect(() => {
    if (genres.length) {
      let data = genres.map(({ id, title }) => ({ id, title }));
      data.unshift({ id: 'all', title: 'All channels' });
      setGenresData(data);

      // fetch data from all channels initially
      // getChannelsAction({ ...paginatorInfo });
    }
  }, [genres]);

  console.log({ genresData, selectedCategory });

  // get favorites if an item is added
  React.useEffect(() => {
    if (isFavoritesUpdated) {
      setShowSnackBar(true);
      getFavoritesAction();
      getChannelsAction({ limit: 10, pageNumber: 1 });
    }
  }, [isFavoritesUpdated]);

  const handleSubscribeToItem = (channelId) => {
    let index = notifyIds.findIndex((x) => x === parseInt(channelId));

    if (index >= 0) return;

    setNotifyIds(uniq([...notifyIds, parseInt(channelId)]));
  };

  React.useEffect(() => {
    if (notifyIds.length) {
      // set the subscribed variable for the snackbar
      let latestItem = channels.find(({ id }) => parseInt(id) === notifyIds[notifyIds.length - 1]);
      setSubscribed(latestItem.title);

      setShowNotificationSnackBar(true);
    }
  }, [notifyIds]);

  // setup channels data
  React.useEffect(() => {
    if (channels.length) {
      let data = channels.map(({ id, title, ...rest }) => ({
        id,
        title,
        thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`,
        ...rest
      }));
      setChannelsData(data);
    }
  }, [channels]);

  const handleAddToFavorites = (channelId) => {
    let title = channels.find(({ id }) => id === channelId).title;
    setFavorited(title);

    addToFavoritesAction({ videoId: parseInt(channelId) });
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
      setShowNotificationSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
    if (showNotificationSnackBar) hideSnackBar();
  }, [showSnackBar, showNotificationSnackBar]);

  const handleItemSelect = (channelId) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('ChannelDetailScreen', { channelId });
  };

  const onCategorySelect = (id) => {
    // when changing category, reset the pagination info
    resetPaginatorAction();

    // set the selected category in state
    setSelectedCategory(id);
  };

  React.useEffect(() => {
    if (selectedCategory === 'all') {
      // get channels with pageNumber set to 1
      // because at this point we are not paginating
      // we will paginate on scrollEndreached or on a "load more" button is clicked
      getChannelsAction({ limit: 10, pageNumber: 1 });
    } else {
      getChannelsByCategoriesAction({ ...paginatorInfo, categories: [parseInt(selectedCategory)] });
    }
  }, [selectedCategory]);

  // console.log({ channelsData, favorites, paginatorInfo });

  const renderEmpty = () => {
    if (error) return <Text>{error}</Text>;
    // this should only be returned if user did not subscribe to any channels
    return <Text>no channels found</Text>;
  };

  return (
    <View style={styles.container}>
      {channelsData.length ? (
        <React.Fragment>
          {error && <Text>{error}</Text>}
          <ScrollView>
            <SelectorPills
              data={genresData}
              labelkey="title"
              onSelect={onCategorySelect}
              selected={selectedCategory}
            />
            <Spacer />
            {/* featured items section */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Featured TV Channels
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {channelsData.map(({ id, ...itemProps }) => {
                  let isNotificationActive =
                    notifyIds.findIndex((i) => i === parseInt(id)) >= 0 ? true : false;
                  return (
                    <ItemPreview
                      id={id}
                      onSelect={handleItemSelect}
                      handleSubscribeToItem={handleSubscribeToItem}
                      isNotificationActive={isNotificationActive}
                      key={id}
                      {...itemProps}
                    />
                  );
                })}
              </ScrollView>
            </View>

            <View>
              {channelsData.map(({ id, ...itemProps }) => (
                <ListItemChanel
                  key={id}
                  id={id}
                  onSelect={handleItemSelect}
                  onRightActionPress={handleAddToFavorites}
                  {...itemProps}
                  full
                />
              ))}
            </View>
            <Spacer size={100} />
          </ScrollView>
        </React.Fragment>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {!isFetching ? renderEmpty() : null}
          <Spacer size={100} />
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 30,
          paddingTop: 15,
          paddingBottom: 30,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TouchableWithoutFeedback
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('ItvFavoritesScreen')}
        >
          <Icon name="heart-solid" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Favorites</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={{ alignItems: 'center' }}
          onPress={() => navigation.navigate('ItvDownloadsScreen')}
        >
          <Icon name="download" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Downloaded</Text>
        </TouchableWithoutFeedback>
      </View>

      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
      <SnackBar
        visible={showNotificationSnackBar}
        message={`You will now receive notifications from ${subscribed}`}
        iconName="notifications"
        iconColor="#FF5050"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  genres: selectGenres,
  paginatorInfo: selectPaginatorInfo,
  channels: selectChannels,
  isFavoritesUpdated: selectAddedToFavorites
});

const actions = {
  getGenresAction: Creators.getGenres,
  getChannelsAction: Creators.getChannels,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  resetPaginatorAction: Creators.resetPaginator,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories,
  getFavoritesAction: Creators.getFavorites,
  addToFavoritesAction: Creators.addToFavorites
};

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader
)(ItvScreen);
