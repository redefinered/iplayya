/* eslint-disable react/prop-types */

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
// import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/isports/isports.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  // selectPaginatorInfo,
  selectGenres,
  selectChannels,
  selectAddedToFavorites,
  selectFavorites
} from 'modules/ducks/isports/isports.selectors';
import Spacer from 'components/spacer.component';
import uniq from 'lodash/uniq';
import theme from 'common/theme';

const channelplaceholder = require('assets/channel-placeholder.png');

const IsportsScreen = ({
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
  enableSwipeAction
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);

  // const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
  //   true
  // );

  // get genres on mount
  React.useEffect(() => {
    resetPaginatorAction(); // for debugging
    getGenresAction();
    enableSwipeAction(false);
  }, []);

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
        // thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`,
        thumbnail: channelplaceholder,
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

  if (error) {
    <Text>{error}</Text>;
  }

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

  // const handleEndReached = () => {
  //   if (!onEndReachedCalledDuringMomentum) {
  //     if (selectedCategory === 'all') {
  //       getChannelsAction(paginator);
  //       setOnEndReachedCalledDuringMomentum(true);
  //       return;
  //     }

  //     /// if selected category is anything other than 'all'
  //     getChannelsByCategoriesAction({
  //       categories: [parseInt(selectedCategory)],
  //       ...paginator
  //     });
  //     setOnEndReachedCalledDuringMomentum(true);
  //   }
  // };

  const renderEmpty = () => {
    if (error) return <Text>{error}</Text>;
    // this should only be returned if user did not subscribe to any channels
    return <Text>no channels found</Text>;
  };

  // const renderChannels = () => {
  //   if (!channelsData) return;

  //   return (
  //     <React.Fragment>
  //       <View style={{ marginBottom: theme.spacing(2) }}>
  //         <ContentWrap>
  //           <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
  //             Featured TV Channels
  //           </Text>
  //         </ContentWrap>
  //         <FlatList
  //           data={channelsData}
  //           horizontal
  //           bounces={false}
  //           renderItem={renderFeaturedItem}
  //           showsHorizontalScrollIndicator={false}
  //           style={{ paddingHorizontal: theme.spacing(2) }}
  //         />
  //       </View>
  //       <FlatList
  //         data={channelsData}
  //         keyExtractor={(item) => item.id}
  //         onEndReached={() => handleEndReached()}
  //         onEndReachedThreshold={0.5}
  //         onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
  //         renderItem={({ item: { epgtitle, ...itemProps } }) => (
  //           <ListItemChanel
  //             onSelect={handleItemSelect}
  //             onRightActionPress={handleAddToFavorites}
  //             full
  //             epgtitle={epgtitle}
  //             {...itemProps}
  //           />
  //         )}
  //         ListFooterComponent={
  //           <View style={{ flex: 1, height: size ? size.height + theme.spacing(3) : 0 }} />
  //         }
  //       />
  //     </React.Fragment>
  //   );
  // };

  return (
    <View style={styles.container}>
      {channelsData.length ? (
        <React.Fragment>
          {error && <Text>{error}</Text>}
          <ScrollView showsVerticalScrollIndicator={false}>
            <SelectorPills
              data={genresData}
              labelkey="title"
              onSelect={onCategorySelect}
              selected={selectedCategory}
            />
            <Spacer size={2} />
            {/* featured items section */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Featured Live Sports
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
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 4,
          position: 'absolute',
          width: '100%',
          bottom: 0,
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
            onPress={() => navigation.navigate('IsportsFavoritesScreen')}
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
              borderRadius: 34,
              height: 67,
              width: 67,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            borderless={true}
            onPress={() => navigation.replace('HomeScreen')}
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
            onPress={() => navigation.navigate('IsportsDownloadsScreen')}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="download" size={theme.iconSize(3)} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
                Downloads
              </Text>
            </View>
          </TouchableRipple>
        </View>
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

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IsportsScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  genres: selectGenres,
  // paginator: selectPaginator,
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
  addToFavoritesAction: Creators.addToFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
