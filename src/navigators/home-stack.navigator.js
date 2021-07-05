/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme, TouchableRipple } from 'react-native-paper';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import Icon from 'components/icon/icon.component.js';

import HomeScreen from 'screens/home/home.screen';

import ItvScreen from 'screens/itv/itv.screen';
import ItvFavoritesScreen from 'screens/itv-favorites/itv-favorites.screen';
// import ItvDownloadsScreen from 'screens/itv-downloads/itv-downloads.screen';
import ItvSearchScreen from 'screens/itv/itv-search.screen';
import ChannelDetailScreen from 'screens/channel-detail/channel-detail.screen';

import ImovieScreen from 'screens/imovie/imovie.screen';
import ImovieSearchScreen from 'screens/imovie/imovie-search.screen';
import ImovieFavoritesScreen from 'screens/imovie-favorites/imovie-favorites.screen';
import ImovieDownloadsScreen from 'screens/imovie-downloads/imovie-downloads.screen';
import MovieDetailScreen from 'screens/movie-detail/movie-detail.screen';
import SeriesDetailScreen from 'screens/series-detail/series-detail.screen';
import MovieDetailDownloadedScreen from 'screens/movie-detail-downloaded/movie-detail-downloaded.screen';

import IradioScreen from 'screens/iradio/iradio.screen';

import ImusicScreen from 'screens/imusic/imusic.screen';
import ImusicSearchScreen from 'screens/imusic/imusic-search.screen';
import AlbumDetailScreen from 'screens/album-detail/album-detail.screen';
import MusicPlayerScreen from 'screens/music-player/music-player.screen';
import ImusicFavoriteButton from 'screens/imusic/add-to-favorites-button.component';

import IplayScreen from 'screens/iplay/iplay.screen';
import IplayDetailScreen from 'screens/iplay/iplay-detail.screen';

import IsportsScreen from 'screens/isports/isports.screen';
import IsportsSearchScreen from 'screens/isports/isports-search.screen';
import IsportsFavoritesScreen from 'screens/isports-favorites/isports-favorites.screen';
import IsportsDownloadsScreen from 'screens/isports-downloads/isports-downloads.screen';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import { createStructuredSelector } from 'reselect';
import { selectFavorites } from 'modules/ducks/movies/movies.selectors';
import AddToFavoritesButton from 'components/add-to-favorites-button/add-to-favorites-button.component';
import DownloadButton from 'components/download-button/download-button.component';

import NowPlaying from 'components/now-playing/now-playing.component';
import { useNavigation } from '@react-navigation/native';

import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

const HomeStack = ({ setBottomTabsVisibleAction, favorites, favoriteTracks }) => {
  const navigation = useNavigation();
  return (
    <React.Fragment>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerTransparent: true,
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerBackImage: () => <HeaderBackImage />,
          headerStyle: { height: headerHeight },
          headerTitleAlign: 'center',
          headerTitleStyle: { fontSize: 24 },
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: {
            paddingLeft: 15,
            justifyContent: 'center',
            alignItems: 'center'
          },
          headerRightContainerStyle: styles.headerRightContainerStyle
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'iPlayya',
            animationEnabled: false
          }}
        />
        <Stack.Screen
          name="ItvScreen"
          component={ItvScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iTV',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  onPress={() => navigation.navigate('ItvSearchScreen')}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                >
                  <View style={{ ...styles.headerButtonContainer }}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ItvFavoritesScreen"
          component={ItvFavoritesScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Favorites',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.navigate('ItvSearchScreen')}
                >
                  <View style={{ ...styles.headerButtonContainer }}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        {/* <Stack.Screen
        name="ItvDownloadsScreen"
        component={ItvDownloadsScreen}
        // eslint-disable-next-line no-unused-vars
        options={({ navigation }) => ({
          title: 'Downloads',
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableRipple
                borderless={true}
                style={{ borderRadius: 44, padding: 8 }}
                rippleColor="rgba(0,0,0,0.28)"
                onPress={() => navigation.navigate('ItvSearchScreen')}
              >
                <View style={{ ...styles.headerButtonContainer }}>
                  <Icon name="search" size={24} />
                </View>
              </TouchableRipple>
            </View>
          )
        })}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      /> */}
        <Stack.Screen
          name="ItvSearchScreen"
          component={ItvSearchScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Search',
            headerLeft: null, // hide back button
            // animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.goBack()}
                >
                  <View style={{ ...styles.headerButtonContainer }}>
                    <Icon name="close" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            ),
            ...TransitionPresets.ModalSlideFromBottomIOS
          })}
        />

        <Stack.Screen
          name="IsportsSearchScreen"
          component={IsportsSearchScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Search',
            headerLeft: null, // hide back button
            // animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.goBack()}
                >
                  <View style={{ ...styles.headerButtonContainer }}>
                    <Icon name="close" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            ),
            ...TransitionPresets.ModalSlideFromBottomIOS
          })}
        />

        {/* imovie */}
        <Stack.Screen
          name="ImovieScreen"
          component={ImovieScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iMovie',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.navigate('ImovieSearchScreen')}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ImovieSearchScreen"
          component={ImovieSearchScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Search',
            headerLeft: null, // hide back button
            // animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.goBack()}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="close" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            ),
            ...TransitionPresets.ModalSlideFromBottomIOS
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ImovieFavoritesScreen"
          component={ImovieFavoritesScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Favorites',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ImovieDownloadsScreen"
          component={ImovieDownloadsScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Downloads',
            animationEnabled: false
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="MovieDetailScreen"
          component={MovieDetailScreen}
          // eslint-disable-next-line no-unused-vars
          options={(props) => {
            const {
              route: {
                params: { videoId }
              }
            } = props;

            const isInFavorites = favorites.findIndex(({ id }) => id === videoId);

            return {
              title: null,
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <AddToFavoritesButton
                    videoId={parseInt(videoId)}
                    alreadyInFavorites={isInFavorites >= 0 ? true : false}
                  />
                  <DownloadButton videoId={videoId} />
                </View>
              )
            };
          }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="SeriesDetailScreen"
          component={SeriesDetailScreen}
          // eslint-disable-next-line no-unused-vars
          options={(props) => {
            const {
              route: {
                params: { videoId }
              }
            } = props;

            const isInFavorites = favorites.findIndex(({ id }) => id === videoId);

            return {
              title: null,
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <AddToFavoritesButton
                    videoId={parseInt(videoId)}
                    alreadyInFavorites={isInFavorites >= 0 ? true : false}
                  />
                  <DownloadButton videoId={videoId} />
                </View>
              )
            };
          }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        {/* <Stack.Screen
        name="SeriesDetailScreen"
        component={SeriesDetailScreen}
        // eslint-disable-next-line no-unused-vars
        options={(props) => {
          const {
            route: {
              params: { videoId }
            }
          } = props;

          const isInFavorites = favorites.findIndex(({ id }) => id === videoId);

          return {
            title: null,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <AddToFavoritesButton
                  videoId={parseInt(videoId)}
                  alreadyInFavorites={isInFavorites >= 0 ? true : false}
                />
                <DownloadButton videoId={videoId} />
              </View>
            )
          };
        }}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      /> */}
        <Stack.Screen
          name="MovieDetailDownloadedScreen"
          component={MovieDetailDownloadedScreen}
          // eslint-disable-next-line no-unused-vars
          options={{ title: null }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />

        {/* iradio */}
        <Stack.Screen
          name="IradioScreen"
          component={IradioScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iRadio',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />

        {/* iMusic */}
        <Stack.Screen
          name="ImusicScreen"
          component={ImusicScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iMusic',
            animationEnabled: false,
            // headerLeft: () => <Text>asd</Text>,
            headerBackImage: () => (
              <View style={styles.backButtonContainer}>
                <Icon name="close" style={{ color: 'white' }} size={24} />
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.navigate('ImusicSearchScreen')}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ImusicSearchScreen"
          component={ImusicSearchScreen}
          options={({ navigation }) => ({
            title: 'Search Music',
            headerLeft: null, // hide back button
            // animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.goBack()}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="close" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            ),
            ...TransitionPresets.ModalSlideFromBottomIOS
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />

        <Stack.Screen
          name="AlbumDetailScreen"
          component={AlbumDetailScreen}
          options={(props) => {
            const {
              route: {
                params: {
                  album: { id: albumId }
                }
              }
            } = props;

            // const isInFavorites = favorites.findIndex(({ id }) => id === albumId);

            return {
              title: null,
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <ImusicFavoriteButton id={albumId} type="album" active />
                  {/* <DownloadButton albumId={albumId} /> */}
                </View>
              )
            };
          }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />

        <Stack.Screen
          name="IplayScreen"
          component={IplayScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iPlay',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="IplayDetailScreen"
          component={IplayDetailScreen}
          options={() => ({
            // headerShown: false,
            title: null,
            animationEnabled: false
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="IsportsScreen"
          component={IsportsScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'iSports',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  onPress={() => navigation.navigate('IsportsSearchScreen')}
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="IsportsFavoritesScreen"
          component={IsportsFavoritesScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Favorites',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.navigate('ItvSearchScreen')}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="IsportsDownloadsScreen"
          component={IsportsDownloadsScreen}
          // eslint-disable-next-line no-unused-vars
          options={({ navigation }) => ({
            title: 'Downloads',
            animationEnabled: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableRipple
                  borderless={true}
                  style={{ borderRadius: 44, padding: 8 }}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => navigation.navigate('ItvSearchScreen')}
                >
                  <View style={styles.headerButtonContainer}>
                    <Icon name="search" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            )
          })}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="ChannelDetailScreen"
          component={ChannelDetailScreen}
          // eslint-disable-next-line no-unused-vars
          options={() => {
            return {
              title: null,
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableRipple
                    borderless={true}
                    style={{ borderRadius: 44, padding: 8 }}
                    rippleColor="rgba(0,0,0,0.28)"
                  >
                    <View style={styles.headerButtonContainer}>
                      <Icon name="heart-solid" size={24} />
                    </View>
                  </TouchableRipple>
                  {/* <ChannelDownloadButton channelId={channelId} archived_link={archived_link} /> */}
                </View>
              )
            };
          }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
        <Stack.Screen
          name="MusicPlayerScreen"
          component={MusicPlayerScreen}
          // eslint-disable-next-line no-unused-vars
          options={(props) => {
            const {
              route: {
                params: { id: trackId }
              }
            } = props;

            // const isInFavorites = favorites.findIndex(({ id }) => id === albumId);
            return {
              title: null,
              headerBackImage: () => <HeaderBackImage vertical />,
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <ImusicFavoriteButton id={trackId} type="track" active />
                  {/* <DownloadButton albumId={albumId} /> */}
                </View>
              ),
              ...TransitionPresets.ModalSlideFromBottomIOS
            };
          }}
          listeners={{
            focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
            beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
          }}
        />
      </Stack.Navigator>

      <NowPlaying navigation={navigation} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
    // marginLeft: 15
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  updateDownloadsAction: MoviesActionCreators.updateDownloads,
  updateDownloadsProgressAction: MoviesActionCreators.updateDownloadsProgress
};

const mapStateToProps = createStructuredSelector({
  favorites: selectFavorites
  // movieUrl: selectMovieUrl,
  // movieTitle: selectMovieTitle,
  // downloads: selectDownloads
});

export default compose(connect(mapStateToProps, actions), withTheme)(HomeStack);
