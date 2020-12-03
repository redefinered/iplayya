/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import ContentWrap from 'components/content-wrap.component';
import Video from 'react-native-video';
import VideoControls from 'components/video-controls/video-controls.component';
import { Text } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as MovieActionCreators } from 'modules/ducks/movie/movie.actions';
import { createStructuredSelector } from 'reselect';
import { selectError, selectIsFetching } from 'modules/ducks/movie/movie.selectors';
import { urlEncodeTitle } from './movie-detail.utils';
import { createFontFormat } from 'utils';

import video from './sample-video.json';

const MovieDetailScreen = ({ theme, playbackStartAction, updatePlaybackInfoAction }) => {
  const [showControls, setShowControls] = React.useState(true);

  const {
    title,
    year,
    description,
    // time,
    rating_mpaa,
    age_rating,
    category,
    director,
    rtsp_url,
    ...otherFields
  } = video;

  React.useEffect(() => {
    playbackStartAction();
  }, []);

  const [paused, setPaused] = React.useState(true);

  let player = React.useRef(null);

  const onBuffer = () => {
    console.log('buffer callback');
  };

  const videoError = () => {
    console.log('video error');
  };

  const handlePlaybackResume = (event) => {
    console.log({ event });
  };

  const handleProgress = (playbackInfo) => {
    // console.log({ playbackInfo });
    updatePlaybackInfoAction({ playbackInfo });
  };

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  const toggleControlVisible = () => {
    setShowControls(!showControls);
  };

  return (
    <View>
      {/* Player */}
      <View>
        <View
          style={{
            width: '100%',
            height: 211,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Video
            paused={paused}
            onProgress={handleProgress}
            // controls
            fullscreenOrientation="landscape"
            source={{ uri: rtsp_url.split(' ')[1] }}
            ref={player}
            onBuffer={() => onBuffer()}
            onError={() => videoError()}
            poster={`https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`}
            style={{ width: Dimensions.get('window').width, height: 211, backgroundColor: 'black' }}
          />
          <VideoControls
            paused={paused}
            togglePlay={handleTogglePlay}
            style={{ position: 'absolute' }}
            visible={showControls}
          />
        </View>
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}-${age_rating}, ${category}`}</Text>
        </ContentWrap>
      </View>

      {/* content */}
      <ScrollView style={{ height: 300 }}>
        <ContentWrap>
          <Pressable onPress={() => toggleControlVisible()}>
            <Text>toggle control</Text>
          </Pressable>
          <Text
            style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}
          >{`${title} (${year})`}</Text>
          <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>{description}</Text>
          <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
            <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}>
              Director{' '}
            </Text>
            {director}
          </Text>
          {Object.keys(otherFields).map((key) => (
            <Text key={key} style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
              <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}>
                {key}{' '}
              </Text>
              {otherFields[key]}
            </Text>
          ))}
          <Pressable style={styles.settingItem} onPress={() => setPaused(false)}>
            <View style={styles.iconContainer}>
              <Icon name="circular-play" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Play movie</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="watch" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Watch trailer</Text>
            </View>
          </Pressable>
        </ContentWrap>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  },
  controls: {
    position: 'absolute'
  }
});

const actions = {
  playbackStartAction: MovieActionCreators.playbackStart,
  updatePlaybackInfoAction: MovieActionCreators.updatePlaybackInfo
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withTheme
)(MovieDetailScreen);
