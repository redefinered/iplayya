/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, InteractionManager } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import CategoryPills from './category-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import ItvBottomTabs from './itv-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import ItvWalkThrough from 'components/walkthrough-guide/itv-walkthrough.component';
import { selectHeaderHeight, selectItvGenres } from 'modules/app';
import {
  selectError,
  selectIsFetching,
  selectPaginator,
  selectChannels,
  selectFavorites,
  selectFavoritesListUpdated,
  selectFavoritesPaginator
} from 'modules/ducks/itv/itv.selectors';
import uniq from 'lodash/uniq';
import theme from 'common/theme';

const channelplaceholder = require('assets/channel-placeholder.png');

const ITEM_HEIGHT = 96;

const ItvScreen = ({
  error,
  updated,
  genres,
  channels,
  paginator,
  navigation,
  isFetching,
  headerHeight,
  route: { params },
  favoritesPaginator,
  getChannelsAction,
  enableSwipeAction,
  getFavoritesAction,
  addToFavoritesAction,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  getChannelsByCategoriesStartAction
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  React.useEffect(() => {
    // resetPaginatorAction(); // for debugging
    enableSwipeAction(false);

    resetPaginatorAction();
  }, []);

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
      handleShowSnackBar();
      getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
      getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
    }
  }, [updated]);

  const handleSubscribeToItem = (channelId) => {
    let index = notifyIds.findIndex((x) => x === parseInt(channelId));

    if (index >= 0) return removeChannelFromNotifyIds(channelId);

    setNotifyIds(uniq([...notifyIds, parseInt(channelId)]));
  };

  const removeChannelFromNotifyIds = (channelId) => {
    setNotifyIds(notifyIds.filter((id) => id !== parseInt(channelId)));
  };

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (notifyIds.length) {
        // set the subscribed variable for the snackbar
        let latestItem = channels.find(
          ({ id }) => parseInt(id) === notifyIds[notifyIds.length - 1]
        );
        setSubscribed(latestItem.title);

        setShowNotificationSnackBar(true);
      }
    });
  }, [notifyIds]);

  // setup channels data
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
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
    });
  }, [channels]);

  const handleWalkthroughGuideHide = () => {
    setShowWalkthroughGuide(false);
  };

  const handleAddToFavorites = (channelId) => {
    let channel = channels.find(({ id }) => id === channelId);
    // if channel is not found stop
    if (typeof channel === 'undefined') return;

    const { is_favorite } = channel;

    // stop if already added
    if (is_favorite) return;

    addToFavoritesAction(parseInt(channelId));
    // setShowSnackBar(true);
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

  const handleShowSnackBar = () => {
    setShowSnackBar(true);
  };

  const handleItemPress = (item) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('ItvChannelDetailScreen', { channelId: item.id });
  };

  const onCategorySelect = (id) => {
    getChannelsByCategoriesStartAction();

    // when changing category, reset the pagination info
    resetPaginatorAction();

    // set the selected category in state
    setSelectedCategory(id);
  };

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      // if (paginator.pageNumber > 1) return;
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

  // eslint-disable-next-line no-unused-vars
  const renderError = () => {
    if (error)
      return (
        <ContentWrap>
          <Text>{error}</Text>
        </ContentWrap>
      );
  };

  const renderFeaturedItem = ({ item }) => {
    let isNotificationActive = notifyIds.findIndex((i) => i === parseInt(item)) >= 0 ? true : false;
    return (
      <ItemPreview
        item={item}
        onSelect={handleItemPress}
        handleSubscribeToItem={handleSubscribeToItem}
        isNotificationActive={isNotificationActive}
      />
    );
  };

  const handleEpgButtonPress = (id) => {
    navigation.navigate('ItvProgramGuideScreen', { channelId: id });
  };

  const renderLisHeader = () => {
    return (
      <View style={{ marginBottom: theme.spacing(2) }}>
        <ContentWrap>
          <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
            Featured TV Channels
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
        renderItem={({ item }) => (
          <ListItemChanel
            full
            item={item}
            isCatchUpAvailable={false}
            onRightActionPress={handleAddToFavorites}
            onEpgButtonPressed={handleEpgButtonPress}
            handleItemPress={handleItemPress}
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

      <ItvBottomTabs />

      <ItvWalkThrough visible={showWalkthroughGuide} onButtonClick={handleWalkthroughGuideHide} />

      <SnackBar
        visible={showSnackBar}
        message="Channel is added to your Favorites list"
        // message={`${favorited} is added to your Favorites list`}
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
    flex: 1,
    marginTop: theme.spacing(2)
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  paginator: selectPaginator,
  favoritesPaginator: selectFavoritesPaginator,
  genres: selectItvGenres,
  channels: selectChannels,
  updated: selectFavoritesListUpdated,
  headerHeight: selectHeaderHeight
});

const actions = {
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

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
