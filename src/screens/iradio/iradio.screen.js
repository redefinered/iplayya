/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import RadioStationsTab from './radios-stations-tab.component';
import FavoritesTab from './favorites-tab.component';
import NowPlaying from './iradio-nowplaying.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import {
  selectError,
  selectIsFetching,
  selectRadioStations,
  selectPaginator
} from 'modules/ducks/iradio/iradio.selectors';
import { createFontFormat } from 'utils';
import { selectPaginatorInfo } from 'modules/ducks/iradio/iradio.selectors';
import withLoader from 'components/with-loader.component';
import theme from 'common/theme';

const initialLayout = { width: Dimensions.get('window').width };

const IradioScreen = ({
  navigation,
  error,
  radioStations,
  getRadiosAction,
  getFavoritesAction,
  paginatorInfo,
  paginator,
  enableSwipeAction,
  setNowPlayingAction,
  getRadiosStartAction
}) => {
  const [index, setIndex] = React.useState(0);
  const [nowPlaying, setNowPlaying] = React.useState(null);
  const [bottomNavHeight, setBottomNavHeight] = React.useState();

  console.log({ nowPlaying });

  React.useEffect(() => {
    getRadiosStartAction();
    getRadiosAction(paginator);
    getFavoritesAction(paginatorInfo);
  }, []);

  const [routes] = React.useState([
    { key: 'radios', title: 'Radio Stations' },
    { key: 'favorites', title: 'Favorites' }
  ]);

  React.useEffect(() => {
    enableSwipeAction(false);
  }, []);

  // const renderScene = SceneMap({
  //   // eslint-disable-next-line react/display-name
  //   radios: RadioStationsTab,
  //   favorites: FavoritesTab
  // });
  const handleSelectItem = (item) => {
    // const { source, title, artist, thumbnail } = item;
    const { cmd, name, number } = item;

    console.log({ item });
    setNowPlaying({ source: cmd, title: name, number: parseInt(number) });
    setNowPlayingAction({ number: parseInt(number), url: cmd, title: name });
  };

  const handleSetBottomTabsHeight = (event) => {
    const { layout } = event.nativeEvent;
    setBottomNavHeight(layout.height);
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
      {radioStations.length ? (
        <React.Fragment>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => {
              return (
                <TabBars
                  {...props}
                  getRadiosAction={getRadiosAction}
                  paginatorInfo={paginatorInfo}
                  getFavoritesAction={getFavoritesAction}
                />
              );
            }}
          />
        </React.Fragment>
      ) : (
        <ContentWrap style={{ justifyContent: 'center' }}>
          <Text>No stations found</Text>
        </ContentWrap>
      )}
      <View style={{ paddingTop: nowPlaying ? 50 : 0 }}>
        {nowPlaying && <NowPlaying navigation={navigation} />}
      </View>
      {/* pushes up the content to make room for the bottom tab */}
      <View style={{ paddingBottom: bottomNavHeight }} />
      <View
        onLayout={handleSetBottomTabsHeight}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#202530',
          // borderTopRightRadius: 24,
          // borderTopLeftRadius: 24,
          paddingHorizontal: 4,
          // paddingTop: 10,
          // paddingBottom: 10,
          borderTopRightRadius: !nowPlaying ? 24 : 0,
          borderTopLeftRadius: !nowPlaying ? 24 : 0,
          // paddingHorizontal: 30,
          // paddingTop: 15,
          // paddingBottom: 30,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TouchableRipple
          onPress={() => navigation.replace('HomeScreen')}
          // style={{ alignItems: 'center' }}
          style={{
            borderRadius: 34,
            height: 67,
            width: 67,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          borderless={true}
          rippleColor="rgba(255,255,255,0.25)"
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="iplayya" size={theme.iconSize(3)} />
            <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};

const TabBars = ({
  navigationState: { index, routes },
  jumpTo,
  paginatorInfo,
  getRadiosAction,
  getFavoritesAction
}) => {
  const theme = useTheme();

  const handleTabSelect = (key) => {
    if (key === 'radios') {
      getRadiosAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
    }
    if (key === 'favorites') {
      getFavoritesAction(paginatorInfo);
    }
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
            {/* <View
              style={{
                width: 60,
                height: 2,
                backgroundColor:
                  routes[index].key === key
                    ? theme.iplayya.colors.vibrantpussy
                    : theme.iplayya.colors.white50
              }}
            /> */}
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
  radioStations: selectRadioStations,
  paginatorInfo: selectPaginatorInfo,
  paginator: selectPaginator
});

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addToFavoritesAction: Creators.addToFavorites,
  getRadiosStartAction: Creators.getStart,
  getRadiosAction: Creators.get,
  getFavoritesAction: Creators.getFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
