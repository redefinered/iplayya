/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { View, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ProgramGuide from './program-guide.component';
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
import { VLCPlayer } from 'react-native-vlc-media-player';
import moment from 'moment';

const dirs = RNFetchBlob.fs.dirs;

const ChannelDetailScreen = ({
  route: {
    params: { channelId }
  },
  error,
  channel,
  getProgramsByChannelAction,
  getChannelAction,

  /// the program that is playing at this moment
  currentProgram
}) => {
  const [paused, setPaused] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded, setIsMoviedownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);

  /// temporary
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);

  // console.log({ isMovieDownloaded });

  /// temporary data
  // const [data, setData] = React.useState(null);

  React.useEffect(() => {
    let date = new Date(Date.now());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
    getChannelAction({ videoId: channelId });
  }, []);

  React.useEffect(() => {
    if (channel) {
      const titlesplit = channel.title.split(' ');
      const title = titlesplit.join('_');
      const filename = `${channelId}_${title}.m3u8`;
      const file = downloadedFiles.find((file) => file === filename);

      // check if downloaded
      if (downloadedFiles.length) {
        if (typeof file !== 'undefined') {
          setIsMoviedownloaded(true);
        } else {
          setIsMoviedownloaded(false);
        }
      }
    }
  }, [channel, downloadedFiles]);

  React.useEffect(() => {
    if (channel && currentProgram) {
      const { title, time, time_to } = currentProgram;
      let startTime = new Date(time);
      let endTime = new Date(time_to);
      const data = {
        id: 6,
        title,
        chanel: channel.title,
        time: `${moment(startTime).format('hh:mm A')} - ${moment(endTime).format('hh:mm A')}`,
        thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Program Title')}`
      };
      setCurrentlyPlaying(data);
    }
  }, [channel, currentProgram]);

  React.useEffect(() => {
    if (channel) {
      const { url, title: channelName } = channel;
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
        setSource(sourceSplit[1]);
        // setSource(`${dirs.DocumentDir}/112238_test112238.mp4`);
      }
    }
    // console.log({ isMovieDownloaded });
  }, [channel, isMovieDownloaded]);

  const isFavorite = false;

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  const handleFovoritePress = () => {
    console.log('add to favorites');
  };

  if (!channel) return <Text>fetching...</Text>;

  const renderPlayer = () => {
    if (source) {
      return (
        <MediaPlayer
          isSeries={false}
          paused={paused}
          source={source}
          thumbnail={currentlyPlaying.thumbnail}
          title={currentlyPlaying.title}
          togglePlay={handleTogglePlay}
          loading={loading}
          setLoading={setLoading}
        />
      );
    }
  };

  console.log({ source });

  return (
    <View>
      {/* Player */}
      <View
        style={{
          width: '100%',
          height: 211,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black'
        }}
      >
        {error && <Text style={{ color: 'red' }}>Erro: something went wrong</Text>}
        {/* <VLCPlayer
          autoplay={true}
          source={{ uri: source }}
          volume={null}
          style={{ width: Dimensions.get('window').width, height: 211 }}
        /> */}
        {renderPlayer()}
      </View>

      <ScrollView>
        <ContentWrap>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20
            }}
          >
            <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                source={{
                  // url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(data.title)}`
                  url: 'http://via.placeholder.com/60x60.png'
                }}
              />
              <Content
                {...currentlyPlaying}
                onRightActionPress={handleFovoritePress}
                isFavorite={isFavorite}
              />
            </View>
          </View>
        </ContentWrap>
        {/* program guide */}

        <View>
          <ContentWrap>
            <Text style={{ ...createFontFormat(16, 22) }}>Program Guide</Text>
          </ContentWrap>

          <ProgramGuide channelId={channelId} />
        </View>
      </ScrollView>
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({ title, chanel, time, onRightActionPress, isFavorite }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{title}</Text>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon
            name="heart-solid"
            size={24}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </View>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {chanel}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>{time}</Text>
          <Icon name="history" color="#13BD38" />
        </View>
      </View>
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const CategoryPill = ({ id, name, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      key={id}
      onPress={() => onSelect(id)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: 34,
        borderRadius: 34,
        marginRight: 10,
        marginBottom: 30
      }}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{name}</Text>
    </Pressable>
  );
};

CategoryPill.defaultProps = {
  selected: '1'
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  channel: selectChannel,
  currentProgram: selectCurrentProgram
});

const actions = {
  getChannelAction: Creators.getChannel,
  getProgramsByChannelAction: Creators.getProgramsByChannel
};

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader
)(ChannelDetailScreen);
