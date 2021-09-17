/* eslint-disable react/prop-types */

import React from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
// import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ProgramGuide from 'components/program-guide/program-guide.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/isports/isports.actions';
import { Creators as NotificationCreators } from 'modules/ducks/notifications/notifications.actions';
// import { createFontFormat } from 'utils';
// import MediaPlayer from 'components/media-player/media-player.component';
import RNFetchBlob from 'rn-fetch-blob';
// import { generateDatesFromToday } from 'utils';
import { createStructuredSelector } from 'reselect';
import IsportsPlayer from './isports-player.component';
import CurrentProgram from './isports-current-program.component';
import {
  selectError,
  selectIsFetching,
  selectChannel,
  selectPrograms,
  selectFavoritesListUpdated
} from 'modules/ducks/isports/isports.selectors';
// import moment from 'moment';
import theme from 'common/theme';

const dirs = RNFetchBlob.fs.dirs;

// generates an array of dates 7 days from now
// let DATES = generateDatesFromToday();
// DATES = DATES.map(({ id, ...rest }) => ({ id: id.toString(), ...rest }));

const IsportsChannelDetailScreen = ({
  route: {
    params: { channelId }
  },
  // eslint-disable-next-line no-unused-vars
  error,
  channel,
  programs,
  getProgramsByChannelAction,
  getChannelAction,
  startAction,
  onNotifResetAction,
  // addToFavoritesAction,
  favoritesListUpdated,
  getProgramsByChannelStartAction,
  navigation
}) => {
  const [paused, setPaused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showFavSnackBar, setShowFavSnackBar] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(null);
  const [fullscreen, setFullscreen] = React.useState(false);

  /// hide status bar if fullscreen
  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };

  /// hide header if fullscreen
  React.useEffect(() => {
    if (fullscreen) return navigation.setOptions({ headerShown: false });

    navigation.setOptions({ headerShown: true });
  }, [fullscreen]);

  React.useEffect(() => {
    /// clears the indicator that there is a new notification
    onNotifResetAction();
    navigation.addListener('beforeRemove', () => {
      getProgramsByChannelStartAction();
    });

    let date = new Date(Date.now());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
    getChannelAction({ videoId: channelId });

    return () => {
      /// this will set the channel to null so that when viewing a channel there is no UI flickering
      startAction();
    };
  }, []);

  React.useEffect(() => {
    if (favoritesListUpdated) {
      getChannelAction({ videoId: channelId });
      handleShowFavSnackBar();
    }
  }, [favoritesListUpdated]);

  // React.useEffect(() => {
  //   if (channel && currentProgram) {
  //     const { title: epgtitle, time, time_to } = currentProgram;
  //     const data = {
  //       title: channel.title,
  //       epgtitle,
  //       time,
  //       time_to,
  //       thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Program Title')}`
  //     };
  //     setCurrentlyPlaying(data);
  //   }
  // }, [channel, currentProgram]);

  React.useEffect(() => {
    if (channel) navigation.setParams({ channel });
    if (channel) {
      const { token, url, title: channelName } = channel;
      const titlesplit = channelName.split(' ');
      const title = titlesplit.join('_');
      const filename = `${channelId}_${title}.m3u8`;

      // console.log({ filename });

      // set source
      if (isMovieDownloaded) {
        setSource(`${dirs.DocumentDir}/${filename}`);
        // setSource(`${dirs.DocumentDir}/112238_test112238.m3u8`);
      } else {
        let sourceSplit = url.split(' ');
        setSource(`${sourceSplit[1]}?token=${token}`);
      }
    }
    // console.log({ isMovieDownloaded });
  }, [channel, isMovieDownloaded]);

  // const isFavorite = false;

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  // const handleFovoritePress = () => {
  //   if (channel.is_favorite) return;

  //   addToFavoritesAction(parseInt(channelId));
  // };

  const handleNextChannel = (nextChannelId) => {
    if (!channel) return;

    let date = new Date(Date.now());

    getChannelAction({ videoId: nextChannelId });
    getProgramsByChannelAction({ channelId: nextChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: nextChannelId });
  };

  const handlePreviousChannel = (previousChannelId) => {
    if (!channel) return;

    let date = new Date(Date.now());

    getChannelAction({ videoId: previousChannelId });
    getProgramsByChannelAction({ channelId: previousChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: previousChannelId });
  };

  const handleShowSnackBar = () => {
    setShowSnackBar(true);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  const handleShowFavSnackBar = () => {
    setShowFavSnackBar(true);
  };

  const hideFavSnackBar = () => {
    setTimeout(() => {
      setShowFavSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showFavSnackBar) hideFavSnackBar();
  }, [showFavSnackBar]);

  const handleDateSelect = React.useCallback((date) => {
    getProgramsByChannelAction({ channelId, date });
  }, []);

  const renderScreenContent = () => {
    if (!fullscreen)
      return (
        <React.Fragment>
          <View>
            <ContentWrap
              onLayout={({ nativeEvent }) => setContentHeight(nativeEvent.layout.height)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: theme.spacing(2)
                }}
              >
                <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
                  {/* <Image
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                source={{
                  url: 'http://via.placeholder.com/60x60.png'
                }}
              /> */}
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 10,
                      backgroundColor: theme.iplayya.colors.white10,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
                  </View>
                  <CurrentProgram channelId={channelId} />
                </View>
              </View>
            </ContentWrap>
            {/* program guide */}

            <ProgramGuide
              programs={programs}
              onDateSelect={handleDateSelect}
              channelId={channelId}
              channelName={channel.title}
              title="Program Guide"
              showSnackBar={handleShowSnackBar}
              contentHeight={contentHeight}
              screen={false}
              parentType="ISPORTS"
            />
          </View>

          <SnackBar
            visible={showSnackBar}
            message="We will remind you before the program start."
            iconName="notifications"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />

          <SnackBar
            visible={showFavSnackBar}
            // message={`${channel.title} is added to your favorites list`}
            message="Channel has been added to Favorites list"
            iconName="heart-solid"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />
        </React.Fragment>
      );
  };

  const setFullScreenPlayerStyle = () => {
    if (fullscreen)
      return {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      };

    return {};
  };

  const renderMediaPlayer = () => {
    if (!source)
      return (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 211,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        />
      );

    return (
      <IsportsPlayer
        channel={channel}
        paused={paused}
        source={source}
        handleNextChannel={handleNextChannel}
        handlePreviousChannel={handlePreviousChannel}
        loading={loading}
        setLoading={setLoading}
        setPaused={setPaused}
        handleTogglePlay={handleTogglePlay}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
    );
  };

  if (!channel) return <View />;

  return (
    <View style={{ flex: 1 }}>
      {renderStatusbar()}

      {/* Player */}
      <View style={{ ...setFullScreenPlayerStyle() }}>{renderMediaPlayer()}</View>

      {renderScreenContent()}
    </View>
  );
};

// eslint-disable-next-line react/prop-types
// const Content = ({ title, epgtitle, time, time_to }) => {
//   const renderEpgtitle = () => {
//     if (!epgtitle)
//       return (
//         <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
//           Program title unavailable
//         </Text>
//       );

//     return (
//       <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
//         {epgtitle}
//       </Text>
//     );
//   };

//   const getSchedule = (time, time_to) => {
//     if (!time || !time_to) return;

//     return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{title}</Text>
//       <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
//         {renderEpgtitle()}
//       </Text>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
//           {getSchedule(time, time_to)}
//         </Text>
//         {/* <Icon name="history" color="#13BD38" /> */}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({ root: { flex: 1, paddingTop: theme.spacing(2) } });

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <IsportsChannelDetailScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  channel: selectChannel,
  programs: selectPrograms,
  favoritesListUpdated: selectFavoritesListUpdated
});

const actions = {
  addToFavoritesAction: Creators.addToFavorites,
  startAction: Creators.start,
  getChannelAction: Creators.getChannel,
  getProgramsByChannelAction: Creators.getProgramsByChannel,
  getProgramsByChannelStartAction: Creators.getProgramsByChannelStart,
  onNotifResetAction: NotificationCreators.onNotifReset
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
