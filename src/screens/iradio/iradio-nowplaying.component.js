import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import Video from 'react-native-video';
import { createFontFormat } from 'utils';
import {
  selectNowPlaying,
  selectPaused,
  selectPlaybackProgress,
  selectIsRadioBackgroundMode,
  selectIsInIradioScreen,
  selectIradioBottomNavLayout
} from 'modules/ducks/iradio/iradio.selectors';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { createStructuredSelector } from 'reselect';
import LottieView from 'lottie-react-native';
import clone from 'lodash/clone';
import theme from 'common/theme';

const NowPlaying = ({
  // eslint-disable-next-line react/prop-types
  navigation,
  nowPlaying,
  // progress,
  // setProgressAction,
  // setNowPlayingAction,
  setNowPlayingLayoutInfoAction,
  // updatePlaybackInfoAction,
  paused,
  setPausedAction,
  isRadioBackgroundMode,
  isInIradioScreen,
  setMusicNowPlaying,
  radioBottomNavLayout
}) => {
  // const rootComponent = React.useRef();
  const player = React.useRef();
  const animation = React.useRef(null);

  const [buffering, setBuffering] = React.useState(false);
  const [playbackInfo, setPlaybackInfo] = React.useState(null);
  const [speed, setSpeed] = React.useState(0);

  React.useEffect(() => {
    if (nowPlaying) {
      if (playbackInfo) {
        // hack playbackInfo because it does not reset when music stops
        const previousPlaybackInfo = clone(playbackInfo);
        setPlaybackInfo(
          Object.assign(previousPlaybackInfo, { currentTime: 0, seekableDuration: 0 })
        );
      }

      const { url } = nowPlaying;
      if (!url) return;

      setPausedAction(false);
    }
  }, [nowPlaying]);

  React.useEffect(() => {
    if (!animation.current) return;

    if (!paused) {
      if (animation.current) {
        setSpeed(1);
        animation.current.play();
      }
    } else {
      setSpeed(0);
      animation.current.pause();
    }
  }, [paused, animation.current]);

  React.useEffect(() => {
    if (nowPlaying) {
      setMusicNowPlaying(null);
    }
  }, [nowPlaying]);

  const visibilityStyles = () => {
    if (isRadioBackgroundMode) return { top: '100%' };

    if (!isInIradioScreen) {
      return { opacity: 0 };
    }

    return { bottom: isInIradioScreen ? radioBottomNavLayout : 0 };
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
    navigation.navigate('IradioPlayerScreen', { radio: nowPlaying });
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
        playInBackground
      />
    );
  };

  if (nowPlaying) {
    // const { url: uri } = nowPlaying;

    return (
      <React.Fragment>
        <TouchableRipple
          onPress={handlePress}
          onLayout={handleOnRootLayout}
          // ref={rootComponent}
          style={{
            backgroundColor: '#202530',
            borderBottomWidth: 1,
            borderColor: theme.iplayya.colors.white10,
            zIndex: theme.iplayya.zIndex.loader,
            position: 'absolute',
            left: 0,
            right: 0,
            ...visibilityStyles()
          }}
        >
          <React.Fragment>
            {renderPlayer()}

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
                <LottieView
                  ref={animation}
                  source={require('../../assets/animation-visualizer.json')}
                  loop
                  speed={speed}
                  style={{ width: 32, height: 32 }}
                />

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
          </React.Fragment>
        </TouchableRipple>
      </React.Fragment>
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
  progress: PropTypes.number,
  isRadioBackgroundMode: PropTypes.bool,
  isInIradioScreen: PropTypes.bool,
  setMusicNowPlaying: PropTypes.func,
  radioBottomNavLayout: PropTypes.number
};

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setProgressAction: Creators.setProgress,
  setNowPlayingLayoutInfoAction: Creators.setNowPlayingLayoutInfo,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  setPausedAction: Creators.setPaused,
  setMusicNowPlaying: MusicCreators.setNowPlaying
};

const mapStateToProps = createStructuredSelector({
  paused: selectPaused,
  progress: selectPlaybackProgress,
  nowPlaying: selectNowPlaying,
  isRadioBackgroundMode: selectIsRadioBackgroundMode,
  isInIradioScreen: selectIsInIradioScreen,
  radioBottomNavLayout: selectIradioBottomNavLayout
});

export default connect(mapStateToProps, actions)(React.memo(NowPlaying));
