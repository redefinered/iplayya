/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import CategoryPills from './category-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import ItvWalkThrough from 'components/walkthrough-guide/itv-walkthrough.component';
import useComponentSize from 'hooks/use-component-size.hook';
import { selectHeaderHeight } from 'modules/app';
import uniq from 'lodash/uniq';
import {
  selectError,
  selectIsFetching,
  selectPaginator,
  selectGenres,
  selectChannels,
  selectFavorites,
  selectFavoritesListUpdated
} from 'modules/ducks/itv/itv.selectors';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvScreen = ({
  navigation,
  error,
  updated,
  genres,
  channels,
  getChannelsByCategoriesStartAction,
  getChannelsStartAction,
  getChannelsAction,
  paginator,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  addToFavoritesAction,
  getFavoritesAction,
  enableSwipeAction,
  route: { params },
  headerHeight
}) => {
  const theme = useTheme();
  const [size, onLayout] = useComponentSize();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  // get genres on mount
  React.useEffect(() => {
    resetPaginatorAction(); // for debugging
    enableSwipeAction(false);
    getChannelsStartAction();

    getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
  }, []);

  // React.useEffect(() => {
  //   if (genreRefreshed) {
  //     getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
  //   }
  // }, [genreRefreshed]);

  React.useEffect(() => {
    if (typeof params !== 'undefined') {
      const { openItvGuide, genreId } = params;

      setSelectedCategory(genreId);
      getChannelsByCategoriesAction({ categories: [parseInt(genreId)] });

      if (!openItvGuide) return;

      setShowWalkthroughGuide(true);
    }
  }, [params]);

  // setup genres data
  React.useEffect(() => {
    if (genres.length) {
      let data = genres.map(({ id, title }) => ({ id, title }));
      data.unshift({ id: 'all', title: 'All channels' });

      setGenresData(data);
    }
  }, [genres]);

  const handleSubscribeToItem = (channelId) => {
    let index = notifyIds.findIndex((x) => x === parseInt(channelId));

    if (index >= 0) return removeChannelFromNotifyIds(channelId);

    setNotifyIds(uniq([...notifyIds, parseInt(channelId)]));
  };

  const removeChannelFromNotifyIds = (channelId) => {
    setNotifyIds(notifyIds.filter((id) => id !== parseInt(channelId)));
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
        thumbnail: channelplaceholder,
        ...rest
      }));
      setChannelsData(data);
    } else {
      setChannelsData([]);
    }
  }, [channels]);

  const handleWalkthroughGuideHide = () => {
    setShowWalkthroughGuide(false);
  };

  const handleAddToFavorites = (channelId) => {
    let channel = channels.find(({ id }) => id === channelId);

    // if channel is not found stop
    if (typeof channel === 'undefined') return;

    const { is_favorite } = channel;

    if (is_favorite) return;

    let title = channels.find(({ id }) => id === channelId).title;
    setFavorited(title);

    addToFavoritesAction(parseInt(channelId));
    // setShowSnackBar(true);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
      setShowNotificationSnackBar(false);
    }, 3000);
  };

  /// if favorites update in backend get feavorites
  React.useEffect(() => {
    if (updated) {
      handleShowSnackBar();
      getFavoritesAction({ pageNumber: 1 });
      getChannelsAction({ pageNumber: 1 });
    }
  }, [updated]);

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
    if (showNotificationSnackBar) hideSnackBar();
  }, [showSnackBar, showNotificationSnackBar]);

  const handleShowSnackBar = () => {
    setShowSnackBar(true);
  };

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
    getChannelsByCategoriesStartAction();

    if (paginator.pageNumber > 1) return;
    if (selectedCategory === 'all') {
      getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    } else {
      getChannelsByCategoriesAction({
        categories: [parseInt(selectedCategory)],
        ...paginator
      });
    }
  }, [selectedCategory]);

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      if (selectedCategory === 'all') {
        getChannelsAction(paginator);
        setOnEndReachedCalledDuringMomentum(true);
        return;
      }

      /// if selected category is anything other than 'all'
      getChannelsByCategoriesAction({
        categories: [parseInt(selectedCategory)],
        ...paginator
      });
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const renderError = () => {
    if (error)
      return (
        <ContentWrap>
          <Text>{error}</Text>
        </ContentWrap>
      );
  };

  const renderFeaturedItem = ({ item: { id, ...itemProps } }) => {
    let isNotificationActive = notifyIds.findIndex((i) => i === parseInt(id)) >= 0 ? true : false;
    return (
      <ItemPreview
        id={id}
        onSelect={handleItemSelect}
        handleSubscribeToItem={handleSubscribeToItem}
        isNotificationActive={isNotificationActive}
        {...itemProps}
      />
    );
  };

  const renderChannels = () => {
    if (!channelsData) return;

    return (
      <React.Fragment>
        <View style={{ marginBottom: theme.spacing(2) }}>
          <ContentWrap>
            <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
              Featured TV Channels
            </Text>
          </ContentWrap>
          <FlatList
            data={channelsData}
            horizontal
            bounces={false}
            renderItem={renderFeaturedItem}
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: theme.spacing(2) }}
          />
        </View>
        <FlatList
          data={channelsData}
          keyExtractor={(item) => item.id}
          onEndReached={() => handleEndReached()}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          renderItem={({ item: { epgtitle, ...itemProps } }) => (
            <ListItemChanel
              onSelect={handleItemSelect}
              onRightActionPress={handleAddToFavorites}
              full
              epgtitle={epgtitle}
              {...itemProps}
            />
          )}
          ListFooterComponent={
            <View style={{ flex: 1, height: size ? size.height + theme.spacing(3) : 0 }} />
          }
        />
      </React.Fragment>
    );
  };

  return (
    <View style={{ height: Dimensions.get('window').height - headerHeight, ...styles.container }}>
      <View>
        <CategoryPills
          data={genresData}
          labelkey="title"
          onSelect={onCategorySelect}
          selected={selectedCategory}
          style={{ marginBottom: theme.spacing(2) }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {renderError()}

        {renderChannels()}
      </View>

      <View
        onLayout={onLayout}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 4,
          width: '100%',
          zIndex: theme.iplayya.zIndex.bottomTabs
        }}
      >
        <View style={{ flex: 4, alignItems: 'center' }}>
          <TouchableRipple
            style={{
              borderRadius: 34,
              height: 67,
              width: 67,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('ItvFavoritesScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="heart-solid" size={theme.iconSize(3)} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
                Favorites
              </Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4, alignItems: 'center' }}>
          <TouchableRipple
            style={{
              borderRadius: 33,
              height: 67,
              width: 67,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] })}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="iplayya" size={theme.iconSize(3)} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4, alignItems: 'center' }}>
          <TouchableRipple
            style={{
              borderRadius: 34,
              height: 67,
              width: 67,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('ItvDownloadsScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="download" size={theme.iconSize(3)} />
              <Text
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  marginTop: 5
                }}
              >
                Downloads
              </Text>
            </View>
          </TouchableRipple>
        </View>
        <ItvWalkThrough visible={showWalkthroughGuide} onButtonClick={handleWalkthroughGuideHide} />
      </View>
      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
      <SnackBar
        visible={showNotificationSnackBar}
        message={`You will now receive notifications from ${subscribed}`}
        iconName="notifications"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ItvScreen {...props} />
  </ScreenContainer>
);

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
  paginator: selectPaginator,
  channels: selectChannels,
  updated: selectFavoritesListUpdated,
  headerHeight: selectHeaderHeight
});

const actions = {
  getGenresAction: Creators.getGenres,
  getChannelsStartAction: Creators.getChannelsStart,
  getChannelsAction: Creators.getChannels,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  resetPaginatorAction: Creators.resetPaginator,
  getChannelsByCategoriesStartAction: Creators.getChannelsByCategoriesStart,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories,
  getFavoritesAction: Creators.getFavorites,
  addToFavoritesAction: Creators.addToFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe,
  reset: Creators.reset
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
