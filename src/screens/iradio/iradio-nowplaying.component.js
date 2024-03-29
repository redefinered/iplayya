import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, Dimensions } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Video from 'react-native-video';
import PlayingAnimationPlaceholder from 'assets/animation-placeholder.svg';
import PausedAnimationPlaceholder from 'assets/paused-animation-placeholder.svg';
import { createFontFormat } from 'utils';
import {
  selectNowPlaying,
  selectPaused,
  selectPlaybackProgress
} from 'modules/ducks/iradio/iradio.selectors';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { createStructuredSelector } from 'reselect';
import clone from 'lodash/clone';

const NowPlaying = ({
  // eslint-disable-next-line react/prop-types
  navigation,
  nowPlaying,
  progress,
  setProgressAction,
  setNowPlayingAction,
  setNowPlayingLayoutInfoAction,
  updatePlaybackInfoAction,
  paused,
  setPausedAction
}) => {
  // console.log({ playbackCounter });
  const theme = useTheme();
  const rootComponent = React.useRef();
  const player = React.useRef();

  const [buffering, setBuffering] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);

  React.useEffect(() => {
    if (playbackInfo) {
      updatePlaybackInfoAction(playbackInfo);

      const { seekableDuration, currentTime } = playbackInfo;

      let percentage = (currentTime / seekableDuration) * 100;

      percentage = percentage === Infinity ? 0 : percentage;
      percentage = isNaN(percentage) ? 0 : percentage;
      setProgressAction(percentage);

      if (Math.ceil(percentage) === 100) playRadio();
    }
  }, [playbackInfo]);

  const playRadio = () => {
    if (nowPlaying.length) {
      const { number } = nowPlaying;

      setNowPlayingAction({
        number: parseInt(number)
      });

      setPausedAction(false);

      // reset progress
      setProgressAction(0);

      return;
    }
  };

  React.useEffect(() => {
    if (nowPlaying) {
      if (playbackInfo) {
        // hack playbackInfo because it does not reset when music stops
        const previousPlaybackInfo = clone(playbackInfo);
        setPlaybackInfo(
          Object.assign(previousPlaybackInfo, { currentTime: 0, seekableDuration: 0 })
        );
      }

      const { source } = nowPlaying;
      if (!source) return;

      setPausedAction(false);
    }
  }, [nowPlaying]);

  const visibilityStyles = () => {
    if (nowPlaying.length) return { top: '100%' };

    return { bottom: 0 };
  };

  const handleOnRootLayout = ({ nativeEvent }) => {
    setNowPlayingLayoutInfoAction(nativeEvent.layout);
  };

  const handleBuffer = () => {
    console.log('buffering...');
    setBuffering(true);
  };

  const handleError = () => {
    console.log('source error');
  };

  const handleProgress = (progressInfo) => {
    setPlaybackInfo(progressInfo);
    setBuffering(false);
  };

  const handlePress = () => {
    const { number } = nowPlaying;
    navigation.navigate('IradioScreen', { number });
  };

  const renderContent = (nowPlaying) => {
    const { title } = nowPlaying;

    return (
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}
        >
          {buffering ? 'Buffering...' : title}
        </Text>
      </View>
    );
  };

  const renderPlayer = () => {
    if (paused) return;

    const { url: uri } = nowPlaying;

    return (
      <Video
        ref={player}
        paused={paused}
        source={{ uri }}
        onBuffer={handleBuffer}
        onError={handleError}
        onProgress={handleProgress}
      />
    );
  };

  if (nowPlaying) {
    // const { url: uri } = nowPlaying;

    return (
      <Pressable
        onPress={handlePress}
        onLayout={handleOnRootLayout}
        ref={rootComponent}
        style={{
          backgroundColor: '#202530',
          borderBottomWidth: 1,
          borderColor: theme.iplayya.colors.white10,
          position: 'absolute',
          left: 0,
          right: 0,
          ...visibilityStyles()
        }}
      >
        {renderPlayer()}

        <View style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}>
          <View
            style={{
              width: (progress * Dimensions.get('window').width) / 100,
              height: 1,
              backgroundColor: theme.iplayya.colors.white10
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: theme.spacing(2),
            paddingHorizontal: theme.spacing(2)
          }}
        >
          <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }}>
            {renderContent(nowPlaying)}
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

            <TouchableRipple
              style={{
                borderRadius: theme.iconSize(4),
                height: theme.iconSize(4),
                width: theme.iconSize(4),
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 10
              }}
              borderless={true}
              rippleColor="rgba(255,255,255,0.25)"
              onPress={() => setPausedAction(!paused)}
            >
              <Icon
                name={paused ? 'circular-play' : 'circular-pause'}
                size={theme.iconSize(4)}
                // style={{ marginHorizontal: 10 }}
              />
            </TouchableRipple>
          </View>
        </View>
        {/* {hasNotch && (
          <View style={{ height: 20, backgroundColor: '#202530' }}>
            <View style={{ height: 1, backgroundColor: theme.iplayya.colors.white10 }} />
          </View>
        )} */}
      </Pressable>
    );
  }

  /// return an empty component if nowPlaying is null
  return <View />;
};

NowPlaying.propTypes = {
  navigation: PropTypes.object,
  theme: PropTypes.object,
  paused: PropTypes.bool,
  setPausedAction: PropTypes.func,
  nowPlaying: PropTypes.object,
  setProgressAction: PropTypes.func,
  setNowPlayingAction: PropTypes.func,
  setNowPlayingLayoutInfoAction: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func,
  progress: PropTypes.number
};

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setProgressAction: Creators.setProgress,
  setNowPlayingLayoutInfoAction: Creators.setNowPlayingLayoutInfo,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  setPausedAction: Creators.setPaused
};

const mapStateToProps = createStructuredSelector({
  paused: selectPaused,
  progress: selectPlaybackProgress,
  nowPlaying: selectNowPlaying
});

export default connect(mapStateToProps, actions)(NowPlaying);
