/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ProgramGuide from 'components/program-guide/program-guide.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { createFontFormat, urlEncodeTitle } from 'utils';
import MediaPlayer from 'components/media-player/media-player.component';
import RNFetchBlob from 'rn-fetch-blob';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectChannel,
  selectCurrentProgram
} from 'modules/ducks/itv/itv.selectors';
import moment from 'moment';

const dirs = RNFetchBlob.fs.dirs;

const ChannelDetailScreen = ({
  navigation,
  route: {
    params: { channelId }
  },
  // eslint-disable-next-line no-unused-vars
  error,
  channel,
  getProgramsByChannelAction,
  getChannelAction,

  /// the program that is playing at this moment
  currentProgram,

  startAction
}) => {
  const [paused, setPaused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');

  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);

  React.useEffect(() => {
    let date = new Date(Date.now());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
    getChannelAction({ videoId: channelId });

    /// clear channel data before going back
    navigation.addListener('beforeRemove', () => {
      startAction();
    });
  }, []);

  React.useEffect(() => {
    if (channel && currentProgram) {
      const { title: epgtitle, time, time_to } = currentProgram;
      const data = {
        title: channel.title,
        epgtitle,
        time,
        time_to,
        thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Program Title')}`
      };
      setCurrentlyPlaying(data);
    }
  }, [channel, currentProgram]);

  React.useEffect(() => {
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

  const handleFovoritePress = () => {
    console.log('add to favorites');
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
          typename={channel.__typename}
          setPaused={setPaused}
        />
      );
    }
  };

  if (!channel) return <View />;

  return (
    <View style={{ marginTop: 10, paddingBottom: 220 }}>
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

      <ScrollView showsHorizontalScrollIndicator={false} bounces={true}>
        <ContentWrap>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20
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
                channeltitle={channel.title}
                onRightActionPress={handleFovoritePress}
              />
            </View>
          </View>
        </ContentWrap>
        {/* program guide */}

        <ProgramGuide channelId={channelId} channelName={channel.title} title="Program Guide" />
      </ScrollView>
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({ channeltitle, title, epgtitle, time, time_to, onRightActionPress }) => {
  const theme = useTheme();
  const [isFavorite] = React.useState(false);
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>
          {title || channeltitle}
        </Text>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon
            name="heart-solid"
            size={24}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </View>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {renderEpgtitle()}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
            {getSchedule(time, time_to)}
          </Text>
          <Icon name="history" color="#13BD38" />
        </View>
      </View>
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <ChannelDetailScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  channel: selectChannel,
  currentProgram: selectCurrentProgram
});

const actions = {
  startAction: Creators.start,
  getChannelAction: Creators.getChannel,
  getProgramsByChannelAction: Creators.getProgramsByChannel
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
