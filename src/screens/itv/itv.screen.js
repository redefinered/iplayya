/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
  selectAddedToFavorites,
  selectFavorites
} from 'modules/ducks/itv/itv.selectors';
import Spacer from 'components/spacer.component';
import uniq from 'lodash/uniq';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvScreen = ({
  isFetching,
  navigation,
  error,
  genres,
  channels,
  getGenresAction,
  getChannelsByCategoriesStartAction,
  getChannelsStartAction,
  getChannelsAction,
  paginator,
  resetPaginatorAction,
  getChannelsByCategoriesAction,
  addToFavoritesAction,
  isFavoritesUpdated,
  getFavoritesAction,
  enableSwipeAction,
  route: { params },

  // eslint-disable-next-line no-unused-vars
  reset
}) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState();
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showNotificationSnackBar, setShowNotificationSnackBar] = React.useState(false);
  const [notifyIds, setNotifyIds] = React.useState([]);
  const [subscribed, setSubscribed] = React.useState('');
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  // get genres on mount
  React.useEffect(() => {
    resetPaginatorAction(); // for debugging
    getGenresAction();
    enableSwipeAction(false);

    getChannelsStartAction();
    getChannelsByCategoriesStartAction();

    setSelectedCategory('all');

    // reset();
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
      // getChannelsAction({ ...paginator });
    }
  }, [genres]);

  // get favorites if an item is added
  React.useEffect(() => {
    if (isFavoritesUpdated) {
      setShowSnackBar(true);
      getFavoritesAction();
      // getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
      getChannelsAction(paginator);
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
        // thumbnail:
        //   'https://venngage-wordpress.s3.amazonaws.com/uploads/2020/04/Curves-Twitch-Banner-Template.png',
        thumbnail: channelplaceholder,
        ...rest
      }));
      setChannelsData(data);
    } else {
      setChannelsData([]);
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
    getChannelsByCategoriesStartAction();

    if (paginator.pageNumber > 1) return;
    if (selectedCategory === 'all') {
      getChannelsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    } else {
      // console.log('fuck!');
      getChannelsByCategoriesAction({
        categories: [parseInt(selectedCategory)],
        ...paginator
        // limit: 10,
        // pageNumber: 1,

        // orderBy: 'number',
        // order: 'asc'
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

  const renderEmpty = () => {
    if (error) return <Text>{error}</Text>;
    // this should only be returned if user did not subscribe to any channels
    return <Text>No channels found</Text>;
  };

  return (
    <View style={styles.container}>
      <View>
        {error && <Text>{error}</Text>}
        <SelectorPills
          data={genresData}
          labelkey="title"
          onSelect={onCategorySelect}
          selected={selectedCategory}
        />

        <ContentWrap style={{ paddingTop: theme.spacing(2) }}>
          {isFetching ? renderEmpty() : <View style={{ height: 0 }} />}
        </ContentWrap>
        {!channelsData.length ? (
          <View />
        ) : (
          <FlatList
            ListHeaderComponent={
              <View style={{ marginBottom: 30 }}>
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
            data={channelsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item: { epgtitle, ...itemProps } }) => (
              <ListItemChanel
                onSelect={handleItemSelect}
                onRightActionPress={handleAddToFavorites}
                full
                epgtitle={epgtitle}
                {...itemProps}
              />
            )}
            onEndReached={() => handleEndReached()}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
          />
        )}
      </View>

      <Spacer size={50} />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 10,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <View style={{ flex: 4 }}>
          <TouchableWithoutFeedback
            style={{ alignItems: 'center' }}
            onPress={() => navigation.navigate('ItvFavoritesScreen')}
          >
            <Icon name="heart-solid" size={24} />
            <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
              Favorites
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 4 }}>
          <TouchableWithoutFeedback
            onPress={() => navigation.replace('HomeScreen')}
            style={{ alignItems: 'center' }}
          >
            <Icon name="iplayya" size={24} />
            <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 4 }}>
          <TouchableWithoutFeedback
            style={{ alignItems: 'center' }}
            onPress={() => navigation.navigate('ItvDownloadsScreen')}
          >
            <Icon name="download" size={24} />
            <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>
              Downloaded
            </Text>
          </TouchableWithoutFeedback>
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
  <ScreenContainer withHeaderPush withLoader>
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
  channels: selectChannels,
  isFavoritesUpdated: selectAddedToFavorites
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
