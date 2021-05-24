/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';
import { TabView } from 'react-native-tab-view';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import RadioStationsTab from './radios-stations-tab.component';
import FavoritesTab from './favorites-tab.component';
import NowPlaying from 'components/now-playing/now-playing.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import {
  selectError,
  selectIsFetching,
  selectRadioStations
} from 'modules/ducks/iradio/iradio.selectors';
import { createFontFormat } from 'utils';
import { selectPaginatorInfo } from 'modules/ducks/iradio/iradio.selectors';

const initialLayout = { width: Dimensions.get('window').width };

const IradioScreen = ({
  navigation,
  error,
  radioStations,
  getRadiosAction,
  getFavoritesAction,
  paginatorInfo,
  enableSwipeAction
}) => {
  const [index, setIndex] = React.useState(0);
  const [nowPlaying, setNowPlaying] = React.useState(null);
  const [bottomNavHeight, setBottomNavHeight] = React.useState();

  React.useEffect(() => {
    getRadiosAction(paginatorInfo);
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
    setNowPlaying(item);
  };

  const handleSetBottomTabsHeight = (event) => {
    const { layout } = event.nativeEvent;
    setBottomNavHeight(layout.height);
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'favorites':
        return <FavoritesTab handleSelectItem={handleSelectItem} />;
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
          <ScrollView>
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
          </ScrollView>
        </React.Fragment>
      ) : (
        <ContentWrap>
          <Text>No stations found</Text>
        </ContentWrap>
      )}

      {nowPlaying && <NowPlaying selected={nowPlaying} navigation={navigation} />}

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
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 10,
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
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={24} />
          <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
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
      getRadiosAction(paginatorInfo);
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
  paginatorInfo: selectPaginatorInfo
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  addToFavoritesAction: Creators.addToFavorites,
  getRadiosAction: Creators.get,
  getFavoritesAction: Creators.getFavorites,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withHeaderPush({ withLoader: true }));

export default enhance(IradioScreen);
