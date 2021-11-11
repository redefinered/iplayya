/* eslint-disable react/prop-types */

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { View, StyleSheet, FlatList, Dimensions, InteractionManager } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
// import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import CategoryPills from './category-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import useComponentSize from 'hooks/use-component-size.hook';
import IsportsBottomTabs from './isports-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/isports/isports.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginator,
  selectGenres,
  selectChannels,
  selectFavorites,
  selectFavoritesListUpdated
} from 'modules/ducks/isports/isports.selectors';
import { selectHeaderHeight } from 'modules/app';
import uniq from 'lodash/uniq';
import theme from 'common/theme';
import { selectFavoritesPaginator } from 'modules/ducks/isports/isports.selectors';

const channelplaceholder = require('assets/channel-placeholder.png');

const ITEM_HEIGHT = 96;

const IsportsScreen = ({
  navigation,
  isFetching,
  error,
  genres,
  channels,
  getChannelsByCategoriesStartAction,
  getChannelsAction,
  paginator,
  favoritesPaginator,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  addToFavoritesAction,
  updated,
  getFavoritesAction,
  enableSwipeAction,
  headerHeight
}) => {
  // eslint-disable-next-line no-unused-vars
  const [size, onLayout] = useComponentSize();

  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  // get genres on mount
  React.useEffect(() => {
    enableSwipeAction(false);

    resetPaginatorAction();
  }, []);

  // setup genres data
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (genres.length) {
        let data = genres.map(({ id, title }) => ({ id, title }));
        data.unshift({ id: 'all', title: 'All channels' });
        setGenresData(data);
      }
    });
  }, [genres]);

  React.useEffect(() => {
    if (updated) {
      setShowSnackBar(true);
      getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
      getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
    }
  }, [updated]);

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
    InteractionManager.runAfterInteractions(() => {
      if (channels.length) {
        let data = channels.map(({ id, title, ...rest }) => ({
          id,
          title,
          // thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`,
          thumbnail: channelplaceholder,
          ...rest
        }));
        setChannelsData(data);
      } else {
        setChannelsData([]);
      }
    });
  }, [channels]);

  const handleAddToFavorites = (channelId) => {
    let channel = channels.find(({ id }) => id === channelId);

    // if channel is not found stop
    if (typeof channel === 'undefined') return;

    const { is_favorite } = channel;

    if (is_favorite) return;

    let title = channels.find(({ id }) => id === channelId).title;
    setFavorited(title);

    addToFavoritesAction(parseInt(channelId));

    // let title = channels.find(({ id }) => id === channelId).title;
    // setFavorited(title);

    // addToFavoritesAction({ videoId: parseInt(channelId) });
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
    navigation.navigate('IsportsChannelDetailScreen', { channelId });
  };

  const onCategorySelect = (id) => {
    getChannelsByCategoriesStartAction();

    // when changing category, reset the pagination info
    resetPaginatorAction();

    // set the selected category in state
    setSelectedCategory(id);
  };

  // React.useEffect(() => {
  //   if (selectedCategory === 'all') {
  //     // get channels with pageNumber set to 1
  //     // because at this point we are not paginating
  //     // we will paginate on scrollEndreached or on a "load more" button is clicked
  //     getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
  //   } else {
  //     getChannelsByCategoriesAction({ ...paginator, categories: [parseInt(selectedCategory)] });
  //   }
  // }, [selectedCategory]);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (selectedCategory === 'all') {
        getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
      } else {
        getChannelsByCategoriesAction({
          categories: [parseInt(selectedCategory)],
          ...paginator
        });
      }
    });
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

  // const renderEmpty = () => {
  //   if (error) return <Text>{error}</Text>;
  //   // this should only be returned if user did not subscribe to any channels
  //   return <Text>no channels found</Text>;
  // };

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

  const handleEpgButtonPress = (id) => {
    navigation.navigate('IsportsProgramGuideScreen', { channelId: id });
  };

  const renderLisHeader = () => {
    return (
      <View style={{ marginBottom: theme.spacing(2) }}>
        <ContentWrap>
          <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
            Featured Sports Channels
          </Text>
        </ContentWrap>
        <FlatList
          data={channelsData.slice(0, 9)}
          horizontal
          bounces={false}
          renderItem={renderFeaturedItem}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: theme.spacing(2) }}
        />
      </View>
    );
  };

  const renderListFooter = () => {
    if (!isFetching) return;

    return (
      <View
        style={{
          paddingTop: theme.spacing(3),
          paddingBottom: theme.spacing(5)
        }}
      >
        <ActivityIndicator />
      </View>
    );
  };

  const renderChannels = () => {
    if (!channelsData) return;

    return (
      <FlatList
        ListHeaderComponent={renderLisHeader()}
        data={channelsData}
        keyExtractor={(item) => item.id}
        onEndReached={() => handleEndReached()}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        getItemLayout={(data, index) => {
          return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
        }}
        renderItem={({ item: { epgtitle, ...itemProps } }) => (
          <ListItemChanel
            isCatchUpAvailable={false}
            onSelect={handleItemSelect}
            onRightActionPress={handleAddToFavorites}
            onEpgButtonPressed={handleEpgButtonPress}
            full
            epgtitle={epgtitle}
            {...itemProps}
          />
        )}
        ListFooterComponent={renderListFooter()}
      />
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

      {/* <View
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
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
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
            onPress={() => navigation.navigate('IsportsFavoritesScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="heart-solid" size={theme.iconSize(3)} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', paddingTop: 5 }}>
                Favorites
              </Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
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
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] })}
            // onPress={() => navigation.replace('HomeScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="iplayya" size={theme.iconSize(3)} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', paddingTop: 5 }}>Home</Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableRipple
            style={{
              borderRadius: 34,
              height: 69,
              width: 69,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('IsportsDownloadsScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="download" size={theme.iconSize(3)} color={theme.iplayya.colors.white25} />
              <Text
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  paddingTop: 5,
                  color: theme.iplayya.colors.white25
                }}
              >
                Downloads
              </Text>
            </View>
          </TouchableRipple>
        </View>
      </View> */}

      <IsportsBottomTabs />

      <SnackBar
        visible={showSnackBar}
        message="Channel is added to your Favorites list"
        // message={`${favorited} is added to your Favorites list`}
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

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IsportsScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.spacing(2)
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  genres: selectGenres,
  paginator: selectPaginator,
  favoritesPaginator: selectFavoritesPaginator,
  channels: selectChannels,
  updated: selectFavoritesListUpdated,
  headerHeight: selectHeaderHeight
});

const actions = {
  getChannelsStartAction: Creators.getChannelsStart,
  getGenresAction: Creators.getGenres,
  getChannelsAction: Creators.getChannels,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  resetPaginatorAction: Creators.resetPaginator,
  getChannelsByCategoriesStartAction: Creators.getChannelsByCategoriesStart,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories,
  getFavoritesAction: Creators.getFavorites,
  addToFavoritesAction: Creators.addToFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
