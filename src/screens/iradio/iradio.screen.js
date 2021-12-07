/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';
import ScreenContainer from 'components/screen-container.component';
import RadioStationsTab from './radios-stations-tab.component';
import FavoritesTab from './favorites-tab.component';
// import NowPlaying from './iradio-nowplaying.component';
import IradioBottomTabs from './iradio-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginator,
  selectNowPlaying
} from 'modules/ducks/iradio/iradio.selectors';
import { createFontFormat } from 'utils';
import { useIsFocused } from '@react-navigation/native';
import Spacer from 'components/spacer.component';

const initialLayout = { width: Dimensions.get('window').width };

const IradioScreen = ({
  // navigation,
  startAction,
  error,
  getRadiosAction,
  getFavoritesAction,
  enableSwipeAction,
  setNowPlayingAction,
  switchInIradioScreenAction,
  setNowPlayingBackgroundModeAction,
  nowPlaying,
  setIradioBottomNavLayoutAction,
  route: { params }
}) => {
  const [index, setIndex] = React.useState(0);
  const [isNowPlaying, setIsNowPlaying] = React.useState(false);
  const [bottomPadding, setBottomPadding] = React.useState(null);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    enableSwipeAction(false);

    // clean up
    return () => startAction();
  }, []);

  React.useEffect(() => {
    if (nowPlaying === null) {
      setIsNowPlaying(false);
    } else {
      setIsNowPlaying(true);
    }
  }, [nowPlaying]);

  React.useEffect(() => {
    setNowPlayingBackgroundModeAction(false);

    // Unsubscribe
    return () => {
      setNowPlayingBackgroundModeAction(true);

      switchInIradioScreenAction(false);
    };
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      switchInIradioScreenAction(true);
    } else {
      switchInIradioScreenAction(false);
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (index === 0) {
      getRadiosAction({ pageNumber: 1, limit: 100, orderBy: 'number', order: 'asc' });
    }

    if (index === 1) {
      startAction();
      getFavoritesAction({ pageNumber: 1, limit: 100, orderBy: 'number', order: 'asc' });
    }
  }, [index]);

  React.useEffect(() => {
    if (params) {
      const { cmd, name, number, ...rest } = params;
      // setNowPlaying({ source: cmd, title: name, number: parseInt(number), ...rest });
      setNowPlayingAction({ number: parseInt(number), url: cmd, title: name, ...rest });
    }
  }, [params]);

  const [routes] = React.useState([
    { key: 'radios', title: 'Radio Stations' },
    { key: 'favorites', title: 'Favorites' }
  ]);

  const handleSelectItem = (item) => {
    // const { source, title, artist, thumbnail } = item;
    const { cmd, name, number, ...rest } = item;

    // setNowPlaying({ source: cmd, title: name, number: parseInt(number), ...rest });
    setNowPlayingAction({ number: parseInt(number), url: cmd, title: name, ...rest });
  };

  const handleBottomTabsLayoutEvent = ({ nativeEvent }) => {
    const {
      layout: { height }
    } = nativeEvent;

    setBottomPadding(height);
    setIradioBottomNavLayoutAction(height);
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'favorites':
        return <FavoritesTab setIndex={setIndex} handleSelectItem={handleSelectItem} />;
      default:
        return <RadioStationsTab handleSelectItem={handleSelectItem} />;
    }
  };

  if (error) {
    <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <React.Fragment>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => {
            return <TabBars {...props} />;
          }}
        />
      </React.Fragment>

      <Spacer size={bottomPadding} />

      <IradioBottomTabs
        nowPlaying={isNowPlaying}
        handleBottomTabsLayoutEvent={handleBottomTabsLayoutEvent}
      />
    </View>
  );
};

const TabBars = ({ navigationState: { index, routes }, jumpTo }) => {
  const theme = useTheme();

  const handleTabSelect = (key) => {
    jumpTo(key);
  };

  return (
    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
      {routes.map(({ key, title }) => (
        <View key={key}>
          <Pressable
            onPress={() => handleTabSelect(key)}
            style={{
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginLeft: 10,
              backgroundColor:
                routes[index].key === key
                  ? theme.iplayya.colors.vibrantpussy
                  : theme.iplayya.colors.white25
            }}
          >
            <Text
              style={{
                color: theme.iplayya.colors.white100,
                fontWeight: routes[index].key === key ? 'bold' : '400',
                ...createFontFormat(14, 19)
              }}
            >
              {title}
            </Text>
          </Pressable>
        </View>
      ))}
      <View style={{ flex: 4 }} />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IradioScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  paginator: selectPaginator,
  nowPlaying: selectNowPlaying
});

const actions = {
  startAction: Creators.start,
  favoritesStartAction: FavoritesCreators.start,
  setNowPlayingAction: Creators.setNowPlaying,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addToFavoritesAction: FavoritesCreators.addToFavorites,
  getRadiosStartAction: Creators.start,
  getRadiosAction: Creators.get,
  getFavoritesAction: FavoritesCreators.getFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator,
  switchInIradioScreenAction: Creators.switchInIradioScreen,
  setNowPlayingBackgroundModeAction: Creators.setNowPlayingBackgroundMode,
  setIradioBottomNavLayoutAction: Creators.setIradioBottomNavLayout
};

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
