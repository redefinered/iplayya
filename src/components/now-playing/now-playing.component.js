import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Pressable, Dimensions } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Video from 'react-native-video';
import PlayingAnimationPlaceholder from 'assets/animation-placeholder.svg';
import PausedAnimationPlaceholder from 'assets/paused-animation-placeholder.svg';
import { createFontFormat } from 'utils';

// const samplemp3 = require('assets/sample.mp3');

const NowPlaying = ({
  // navigation,
  theme,
  selected: { __typename, title, artist, thumbnails, ...radioProps }
}) => {
  const [paused, setPaused] = React.useState(false);
  const [buffering, setBuffering] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (playbackInfo) {
      const { seekableDuration, currentTime } = playbackInfo;
      let percentage = (currentTime / seekableDuration) * 100;

      percentage = percentage === Infinity ? 0 : percentage;
      percentage = isNaN(percentage) ? 0 : percentage;
      setProgress(percentage);
    }
  }, [playbackInfo]);

  const handleBuffer = () => {
    console.log('buffering...');
    setBuffering(true);
  };

  const handleError = () => {
    console.log('source error');
  };

  const handleProgress = (progressInfo) => {
    // console.log('progressInfo', progressInfo);
    setPlaybackInfo(progressInfo);
    setBuffering(false);
  };

  const renderThumbnail = () => {
    if (typeof __typename === 'undefined')
      return (
        <Image
          style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
          source={{
            url: thumbnails.small
          }}
        />
      );
  };

  const renderContent = () => {
    const { name } = radioProps;

    // if audio file
    if (typeof __typename === 'undefined')
      return (
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}>
            {buffering ? 'Buffering...' : title}
          </Text>
          <Text style={{ ...createFontFormat(12, 16) }}>{artist}</Text>
        </View>
      );

    return (
      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}>
          {buffering ? 'Buffering...' : name}
        </Text>
      </View>
    );
  };

  return (
    <Pressable
      // onPress={() => navigation.navigate('MusicPlayerScreen', { id })}
      style={{
        backgroundColor: '#202530',
        borderBottomWidth: 1,
        borderColor: theme.iplayya.colors.white10
      }}
    >
      <Video
        paused={paused}
        source={{ uri: radioProps.cmd }}
        // source={samplemp3}
        onBuffer={handleBuffer}
        onError={handleError}
        onProgress={handleProgress}
      />

      <View style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}>
        <View
          style={{
            width: (progress * Dimensions.get('window').width) / 100,
            height: 1,
            backgroundColor: theme.iplayya.colors.vibrantpussy
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: theme.spacing(4),
          paddingHorizontal: theme.spacing(2)
        }}
      >
        <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }}>
          {renderThumbnail()}

          {renderContent()}
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {paused ? (
            <PausedAnimationPlaceholder style={{ marginHorizontal: 10 }} />
          ) : (
            <PlayingAnimationPlaceholder style={{ marginHorizontal: 10 }} />
          )}

          <Pressable onPress={() => setPaused(!paused)}>
            <Icon
              name={paused ? 'circular-play' : 'circular-pause'}
              size={32}
              style={{ marginHorizontal: 10 }}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

NowPlaying.propTypes = {
  navigation: PropTypes.object.isRequired,
  theme: PropTypes.object,
  selected: PropTypes.object.isRequired
};

export default withTheme(NowPlaying);
