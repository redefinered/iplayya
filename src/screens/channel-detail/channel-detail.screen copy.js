/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ProgramGuide from 'components/program-guide/program-guide.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as ItvActionCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as IsportsActionCreators } from 'modules/ducks/isports/isports.actions';
import { Creators as NotificationCreators } from 'modules/ducks/notifications/notifications.actions';
import { createFontFormat, urlEncodeTitle } from 'utils';
import MediaPlayer from 'components/media-player/media-player.component';
import RNFetchBlob from 'rn-fetch-blob';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectCurrentProgram,
  selectFavoritesListUpdated,
  selectChannel as selectItvChannel,
  selectPrograms as selectItvPrograms
} from 'modules/ducks/itv/itv.selectors';
import {
  selectPrograms as selectIsportsPrograms,
  selectChannel as selectIsportsChannel
} from 'modules/ducks/isports/isports.selectors';
import moment from 'moment';
import theme from 'common/theme';

const dirs = RNFetchBlob.fs.dirs;

const ChannelDetailScreen = ({
  route: {
    params: { channelId, type }
  },
  // eslint-disable-next-line no-unused-vars
  error,
  itvChannel,
  // isportsChannel,
  itvPrograms,
  isportsPrograms,
  getItvProgramsByChannelAction,
  getIsportsProgramsByChannelAction,
  getItvChannelAction,
  getIsportsChannelAction,
  /// the program that is playing at this moment
  currentProgram,
  startAction,
  onNotifResetAction,
  addToFavoritesAction,
  favoritesListUpdated
}) => {
  const [paused, setPaused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showFavSnackBar, setShowFavSnackBar] = React.useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);
  const [contentHeight, setContentHeight] = React.useState(null);
  const [programsData, setProgramsData] = React.useState([]);

  React.useEffect(() => {
    /// clears the indicator that there is a new notification
    onNotifResetAction();

    // let date = new Date(Date.now());
    //Itv getProgramsByChannelAction({ channelId, date: date.toISOString() });
    // getItvChannelAction({ videoId: channelId });
    // getIsportsChannelAction({ videoId: channelId })

    return () => {
      /// this will set the channel to null so that when viewing a channel there is no UI flickering
      startAction();
    };
  }, []);

  React.useEffect(() => {
    let date = new Date(Date.now());

    if (type === 'ITV') {
      setProgramsData(itvPrograms);
      getItvChannelAction({ videoId: channelId });
      getItvProgramsByChannelAction({ channelId, date: date.toISOString() });
      return;
    }

    setProgramsData(isportsPrograms);
    getIsportsChannelAction({ videoId: channelId });
    getIsportsProgramsByChannelAction({ channelId, date: date.toISOString() });
  }, [type]);

  React.useEffect(() => {
    if (favoritesListUpdated) {
      getItvChannelAction({ videoId: channelId });
      handleShowFavSnackBar();
    }
  }, [favoritesListUpdated]);

  React.useEffect(() => {
    if (itvChannel && currentProgram) {
      const { title: epgtitle, time, time_to } = currentProgram;
      const data = {
        title: itvChannel.title,
        epgtitle,
        time,
        time_to,
        thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Program Title')}`
      };
      setCurrentlyPlaying(data);
    }
  }, [itvChannel, currentProgram]);

  React.useEffect(() => {
    if (itvChannel) {
      const { token, url, title: channelName } = itvChannel;
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
  }, [itvChannel, isMovieDownloaded]);

  // const isFavorite = false;

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  const handleFovoritePress = () => {
    if (itvChannel.is_favorite) return;

    addToFavoritesAction(parseInt(channelId));
  };

  const renderPlayer = () => {
    // if (!currentlyPlaying) return;
    if (source) {
      return (
        <MediaPlayer
          isSeries={false}
          paused={paused}
          source={source}
          // thumbnail={currentlyPlaying.thumbnail}
          // title={currentlyPlaying.title}
          togglePlay={handleTogglePlay}
          loading={loading}
          setLoading={setLoading}
          typename={itvChannel.__typename}
          setPaused={setPaused}
        />
      );
    }
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
    if (showSnackBar) hideFavSnackBar();
  }, [showSnackBar]);

  if (!itvChannel) return <View />;

  return (
    <View style={styles.root}>
      {/* Player */}
      <View
        style={{
          width: '100%',
          height: 211,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black'
        }}
      >
        {renderPlayer()}
      </View>

      <View>
        <ContentWrap onLayout={({ nativeEvent }) => setContentHeight(nativeEvent.layout.height)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing(2)
            }}
          >
            <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
              <Image
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                source={{
                  url: 'http://via.placeholder.com/60x60.png'
                }}
              />
              <Content
                {...currentlyPlaying}
                channeltitle={itvChannel.title}
                onRightActionPress={handleFovoritePress}
                isFavorite={itvChannel.is_favorite}
              />
            </View>
          </View>
        </ContentWrap>
        {/* program guide */}

        <ProgramGuide
          programs={programsData}
          channelId={channelId}
          channelName={itvChannel.title}
          title="Program Guide"
          showSnackBar={handleShowSnackBar}
          contentHeight={contentHeight}
          screen={false}
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
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({ channeltitle, title, epgtitle, time, time_to }) => {
  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
          Program title unavailable
        </Text>
      );

    return (
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {epgtitle}
      </Text>
    );
  };

  const getSchedule = (time, time_to) => {
    if (!time || !time_to) return;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{title || channeltitle}</Text>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {renderEpgtitle()}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
          {getSchedule(time, time_to)}
        </Text>
        <Icon name="history" color="#13BD38" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ root: { flex: 1, paddingTop: theme.spacing(2) } });

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <ChannelDetailScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  currentProgram: selectCurrentProgram,
  favoritesListUpdated: selectFavoritesListUpdated,
  itvChannel: selectItvChannel,
  isportsChannel: selectIsportsChannel,
  itvPrograms: selectItvPrograms,
  isportsPrograms: selectIsportsPrograms
});

const actions = {
  addToFavoritesAction: ItvActionCreators.addToFavorites,
  startAction: ItvActionCreators.start,
  getItvChannelAction: ItvActionCreators.getChannel,
  getIsportsChannelAction: IsportsActionCreators.getChannel,
  getItvProgramsByChannelAction: ItvActionCreators.getProgramsByChannel,
  getIsportsProgramsByChannelAction: IsportsActionCreators.getProgramsByChannel,
  onNotifResetAction: NotificationCreators.onNotifReset
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
