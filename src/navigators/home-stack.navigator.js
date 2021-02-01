/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import Icon from 'components/icon/icon.component.js';

import HomeScreen from 'screens/home/home.screen';
import ImovieScreen from 'screens/imovie/imovie.screen';
import ImovieFavoritesScreen from 'screens/imovie-favorites/imovie-favorites.screen';
import ImovieDownloadsScreen from 'screens/imovie-downloads/imovie-downloads.screen';
import IradioScreen from 'screens/iradio/iradio.screen';
import ImusicScreen from 'screens/imusic/imusic.screen';
import IplayScreen from 'screens/iplay/iplay.screen';
import IsportsScreen from 'screens/isports/isports.screen';
import MovieDetailScreen from 'screens/movie-detail/movie-detail.screen';
import MusicPlayerScreen from 'screens/music-player/music-player.screen';
import SportChanelDetailScreen from 'screens/sport-chanel-detail/sport-chanel-detail.screen';

import { connect } from 'react-redux';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
// import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectFavorites,
  selectMovieUrl,
  selectMovieTitle
} from 'modules/ducks/movies/movies.selectors';
import AddToFavoritesButton from 'components/add-to-favorites-button/add-to-favorites-button.component';
import RNFetchBlob from 'rn-fetch-blob';
import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

// eslint-disable-next-line no-unused-vars
const HomeStack = ({
  setBottomTabsVisibleAction,
  favorites,
  // downloadMovieAction,
  movieUrl,
  movieTitle
}) => {
  let dirs = RNFetchBlob.fs.dirs;
  console.log({ dirs });

  const listDownloadedFiles = async () => {
    const ls = await RNFetchBlob.fs.ls(dirs.DocumentDir);
    console.log({ ls });
  };

  React.useEffect(() => {
    listDownloadedFiles();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const deleteFile = async () => {
    await RNFetchBlob.fs.unlink(`${dirs.DocumentDir}/sample.mp4`);
    const ls = await RNFetchBlob.fs.ls(dirs.DocumentDir);
    console.log({ ls });
  };

  // let task = null;

  const handleDownloadMovie = (id, title, url) => {
    console.log({ id, title, url });
    if (typeof url === 'undefined') return;
    // downloadMovieAction({ id, title, url });
  };

  // const handleDownloadMovie = (movie) => {
  //   setDownloading(true);
  //   try {
  //     task = RNFetchBlob.config({
  //       // add this option that makes response data to be stored as a file,
  //       // this is much more performant.
  //       fileCache: true,
  //       path: `${dirs.DocumentDir}/sample.mp4`
  //     }).fetch(
  //       'GET',
  //       'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  //       {
  //         //some headers ..
  //       }
  //     );

  //     task
  //       .progress({ count: 10 }, (received, total) => {
  //         console.log('progress', received / total);
  //       })
  //       .then((res) => {
  //         // the temp file path
  //         console.log('The file saved to ', res.path());
  //         setDownloading(false);
  //       })
  //       .catch((error) => {
  //         throw new Error(error.message);
  //       });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // eslint-disable-next-line no-unused-vars
  // const cancelDownload = () => {
  //   task.cancel();
  // };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTransparent: true,
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerBackImage: () => <HeaderBackImage />,
        headerStyle: { height: headerHeight },
        headerTitleStyle: { fontSize: 24 },
        headerTitleContainerStyle: { paddingTop: 30 },
        headerLeftContainerStyle: {
          paddingLeft: 15,
          justifyContent: 'flex-end'
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
        name="ImovieScreen"
        component={ImovieScreen}
        // eslint-disable-next-line no-unused-vars
        options={({ navigation }) => ({
          title: 'iMovie',
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
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
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
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
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
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
        options={({
          route: {
            params: { videoId }
          }
        }) => {
          const isInFavorites = favorites.findIndex(({ id }) => id === videoId);
          return {
            title: null,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                {/* <Pressable
                  onPress={() => addMovieToFavoritesAction(videoId)}
                  style={styles.headerButtonContainer}
                >
                  <Icon name="heart-solid" size={24} />
                </Pressable> */}
                <AddToFavoritesButton
                  videoId={parseInt(videoId)}
                  alreadyInFavorites={isInFavorites >= 0 ? true : false}
                />
                <Pressable
                  onPress={() => handleDownloadMovie(videoId, movieTitle, movieUrl)}
                  style={styles.headerButtonContainer}
                >
                  <Icon name="download" size={24} />
                </Pressable>
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
        name="IradioScreen"
        component={IradioScreen}
        // eslint-disable-next-line no-unused-vars
        options={({ navigation }) => ({
          title: 'iRadio',
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
        })}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      />
      <Stack.Screen
        name="ImusicScreen"
        component={ImusicScreen}
        // eslint-disable-next-line no-unused-vars
        options={({ navigation }) => ({
          title: 'iMusic',
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
        })}
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
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
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
              <Pressable style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </Pressable>
            </View>
          )
        })}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      />
      <Stack.Screen
        name="SportChanelDetailScreen"
        component={SportChanelDetailScreen}
        // eslint-disable-next-line no-unused-vars
        options={(props) => {
          return {
            title: null,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <Pressable style={styles.headerButtonContainer}>
                  <Icon name="heart-solid" size={24} />
                </Pressable>
                <Pressable style={styles.headerButtonContainer}>
                  <Icon name="download" size={24} />
                </Pressable>
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
        options={{
          title: null,
          headerBackImage: () => <HeaderBackImage vertical />,
          ...TransitionPresets.ModalSlideFromBottomIOS
        }}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
  // downloadMovieAction: Creators.downloadMovie
};

const mapStateToProps = createStructuredSelector({
  favorites: selectFavorites,
  movieUrl: selectMovieUrl,
  movieTitle: selectMovieTitle
});

export default connect(mapStateToProps, actions)(HomeStack);
