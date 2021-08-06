/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginator,
  selectGenres,
  selectChannels,
  selectFavorites
} from 'modules/ducks/itv/itv.selectors';
import Spacer from 'components/spacer.component';
import uniq from 'lodash/uniq';

import ItvWalkThrough from 'components/walkthrough-guide/itv-walkthrough.component';
import useComponentSize from 'hooks/use-component-size.hook';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvScreen = ({
  // isFetching,
  navigation,
  error,
  genres,
  channels,
  favorites,
  // getGenresAction,
  getChannelsByCategoriesStartAction,
  getChannelsStartAction,
  getChannelsAction,
  paginator,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  addToFavoritesAction,
  // isFavoritesUpdated,
  // getFavoritesAction,
  enableSwipeAction,
  route: { params },

  // eslint-disable-next-line no-unused-vars
  reset
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
    // getGenresAction();
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

  React.useEffect(() => {
    if (params) {
      setShowWalkthroughGuide(params.openItvGuide);
    }
  }, [params]);

  const isFavorite = (id) => {
    if (!favorites.length) return false;

    const fr = favorites.find(({ item }) => item.id === id);

    if (typeof fr === 'undefined') return false;

    return true;
  };

  const handleWalkthroughGuideHide = () => {
    setShowWalkthroughGuide(false);
  };

  const handleAddToFavorites = (channelId) => {
    let title = channels.find(({ id }) => id === channelId).title;
    setFavorited(title);

    addToFavoritesAction(parseInt(channelId));
    setShowSnackBar(true);
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

  const handleProgramGuide = (id) => {
    navigation.navigate('ProgramGuidScreen', { channelId: id });
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

  return (
    <View style={styles.container}>
      <View>
        {/* {error && <Text>{error}</Text>} */}
        <SelectorPills
          data={genresData}
          labelkey="title"
          onSelect={onCategorySelect}
          selected={selectedCategory}
          style={{ marginBottom: theme.spacing(2) }}
        />

        {/* {renderError()} errors should give more information rather than just saying "empty" */}

        {!channelsData.length ? (
          <View />
        ) : (
          <FlatList
            data={channelsData}
            keyExtractor={(item) => item.id}
            onEndReached={() => handleEndReached()}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            renderItem={({ item: { epgtitle, ...itemProps } }) => (
              <ListItemChanel
                // handleLongPress={}
                is_favorite={isFavorite}
                onSelect={handleItemSelect}
                onRightActionPress={handleAddToFavorites}
                handleProgramGuide={handleProgramGuide}
                full
                epgtitle={epgtitle}
                {...itemProps}
              />
            )}
            ListHeaderComponent={
              <View style={{ marginBottom: theme.spacing(2) }}>
                <ContentWrap>
                  <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                    Featured TV Channels
                  </Text>
                </ContentWrap>
                <ScrollView
                  style={{ paddingHorizontal: 10 }}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {channelsData.map(({ id, ...itemProps }) => {
                    let isNotificationActive =
                      notifyIds.findIndex((i) => i === parseInt(id)) >= 0 ? true : false;
                    return (
                      <ItemPreview
                        id={id}
                        key={id}
                        onSelect={handleItemSelect}
                        handleSubscribeToItem={handleSubscribeToItem}
                        isNotificationActive={isNotificationActive}
                        {...itemProps}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            }
            ListFooterComponent={
              <View style={{ flex: 1, height: size ? size.height + theme.spacing(3) : 0 }} />
            }
          />
        )}
      </View>

      <Spacer size={50} />

      <View
        onLayout={onLayout}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 4,
          paddingTop: 2,
          paddingBottom: 2,
          position: 'absolute',
          width: '100%',
          bottom: 0,
          zIndex: theme.iplayya.zIndex.bottomTabs
        }}
      >
        <View style={{ flex: 4 }}>
          <TouchableRipple
            style={{ marginHorizontal: 30, borderRadius: 100 }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('ItvFavoritesScreen')}
          >
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <Icon name="heart-solid" size={24} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
                Favorites
              </Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4 }}>
          <TouchableRipple
            style={{ marginHorizontal: 30, borderRadius: 100 }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <Icon name="iplayya" size={24} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={{ flex: 4 }}>
          <TouchableRipple
            style={{ marginHorizontal: 30, borderRadius: 100 }}
            borderless={true}
            rippleColor="rgba(255,255,255,0.25)"
            onPress={() => navigation.navigate('ItvDownloadsScreen')}
          >
            <View style={{ alignItems: 'center', paddingVertical: 10 }}>
              <Icon name="download" size={24} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
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
    flex: 1,
    marginTop: 6
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  genres: selectGenres,
  paginator: selectPaginator,
  channels: selectChannels
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
