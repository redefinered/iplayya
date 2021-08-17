/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import RadioButton from 'components/radio-button/radio-button.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import Icon from 'components/icon/icon.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  selectTask,
  selectVideoForDownloadInfo
} from 'modules/ducks/downloads/downloads.selectors';
import { Creators } from 'modules/ducks/downloads/downloads.actions';
import { checkExistingDownloads, listDownloadedFiles, deleteFile } from 'services/download.service';
import getConfig from 'utils';
import RNBackgroundDownloader from 'react-native-background-downloader';
import theme from 'common/theme';

const DownloadItem = ({
  id,
  title,
  ep,
  year,
  time,
  rating_mpaa,
  age_rating,
  category,
  handleSelectItem,
  downloadsProgress,

  // url is the thumbnail url
  imageUrl: uri,

  // progress,

  task,

  handleLongPress,
  activateCheckboxes,
  selectedItems
  // video,

  // deleteAction
  // updateDownloadsAction,
  // updateDownloadsProgressAction,
  // cleanUpDownloadsProgressAction
}) => {
  // const [isDownloaded] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [broken, setBroken] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  React.useEffect(() => {
    if (typeof task === 'undefined') return setIsDownloaded(true);
    if (task.state === 'PAUSED') return setPaused(true);
    if (task.state === 'PENDING') return setPaused(true);
    if (task.state === 'FAILED') return setBroken(true);
    if (task.state === 'DONE') return setIsDownloaded(true);

    setProgress(task.percent * 100);
    task
      .progress((percent) => {
        console.log(`progress: ${percent * 100}%`);
        setProgress(percent * 100);
      })
      .done(() => {
        setIsDownloaded(true);
        console.log('Download is done!');
      })
      .error((error) => {
        setIsDownloaded(false);
        setBroken(true);
        console.log('Download canceled due to error: ', error);
      });
    // setPaused(false);

    setIsDownloaded(false);
  }, [task]);

  const handleRetry = () => {
    // initialise download here

    setBroken(false);
    // retry download
  };

  const handlePause = () => {
    if (typeof task === 'undefined') return;

    task.pause();

    setPaused(true);
  };

  const handlePlay = async () => {
    if (typeof task === 'undefined') return;

    task.resume();

    setPaused(false);
  };

  const renderPauseButton = () => {
    if (paused)
      return (
        <Pressable onPress={() => handlePlay()}>
          <Icon name="circular-play" size={theme.iconSize(5)} />
        </Pressable>
      );

    if (broken) {
      return (
        <Pressable>
          <Icon name="redo" size={theme.iconSize(5)} />
        </Pressable>
      );
    }

    return (
      <Pressable onPress={() => handlePause()}>
        <Icon name="circular-pause" size={theme.iconSize(5)} />
      </Pressable>
    );
  };

  const renderDownloadControls = () => {
    if (isDownloaded) return;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {renderPauseButton()}
        <Pressable style={{ marginLeft: 10 }}>
          <Icon name="close" size={theme.iconSize(5)} />
        </Pressable>
      </View>
    );
  };

  const renderProgress = () => {
    if (isDownloaded) return;

    return (
      <View
        style={{
          backgroundColor: theme.iplayya.colors.white10,
          position: 'absolute',
          bottom: 0,
          left: 0
        }}
      >
        <View
          style={{
            width: (progress * Dimensions.get('window').width) / 100,
            height: 2,
            backgroundColor: theme.iplayya.colors.vibrantpussy,
            position: 'absolute',
            left: 0,
            bottom: 0
          }}
        />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 2,
            backgroundColor: theme.iplayya.colors.white10,
            position: 'absolute',
            left: 0,
            bottom: 0
          }}
        />
      </View>
    );
  };

  // const handleDownloadMovie = async (video) => {
  //   const { videoId, url, is_series, currentEpisode } = video;

  //   let ep = '';

  //   if (is_series) {
  //     ep = `SO${currentEpisode.season}E${currentEpisode.episode}`;
  //   }

  //   const downloadId = `${videoId}${ep}`;

  //   // return if movie is already downloaded
  //   if (isMovieDownloaded) {
  //     console.log('already downloaded');
  //     return;
  //   }

  //   // return if there is no available source to download
  //   if (typeof url === 'undefined') {
  //     console.log('no source');
  //     return;
  //   }

  //   try {
  //     let config = getConfig(video);

  //     let task = RNBackgroundDownloader.download(config)
  //       .begin((expectedBytes) => {
  //         console.log(`Going to download ${expectedBytes} bytes!`);
  //         downloadStartedAction();
  //       })
  //       .progress((percent) => {
  //         updateDownloadsProgressAction({ id: downloadId, progress: percent * 100 });
  //       })
  //       .done(() => {
  //         console.log('Download is done!');

  //         let completedItems = downloadsProgress.filter(
  //           ({ received, total }) => received === total
  //         );
  //         completedItems = completedItems.map(({ id }) => id);

  //         cleanUpDownloadsProgressAction([video.videoId, ...completedItems]);
  //       })
  //       .error((error) => {
  //         console.log('Download canceled due to error: ', error);
  //         downloadStartFailureAction(error.message);
  //       });

  //     updateDownloadsAction({
  //       id: downloadId,
  //       ep,
  //       task,
  //       movie
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handlePress = (e) => {
    if (!isDownloaded) return;

    handleSelectItem(id);
  };

  return (
    <View style={{ marginBottom: theme.spacing(3) }}>
      <Pressable
        onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
        onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
        style={{
          opacity: isDownloaded ? 1 : 0.5,
          paddingVertical: theme.spacing(1),
          paddingHorizontal: theme.spacing(2),
          flexDirection: 'row',
          // backgroundColor: 'red'
          backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent'
        }}
        onLongPress={() => handleLongPress(id)}
        onPress={handlePress}
        // onPress={() => console.log('fuck')}
      >
        <Image
          style={{
            marginRight: theme.spacing(2),
            width: 65,
            height: 96,
            borderRadius: 8
          }}
          source={{ uri }}
        />

        {/* content */}
        <View style={{ flex: 1, height: 96, justifyContent: 'center' }}>
          {/* title */}
          <Text
            numberOfLines={1}
            style={{
              fontWeight: '700',
              marginBottom: 5,
              ...createFontFormat(16, 22)
            }}
          >
            {`${title} ${ep}`}
          </Text>

          {/* year and duration */}
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50,
              marginBottom: 5
            }}
          >{`${year}, ${Math.floor(time / 60)}h ${time % 60}m`}</Text>

          {/* ratings */}
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50,
              marginBottom: 5
            }}
          >{`${rating_mpaa}-${age_rating}, ${category}`}</Text>
        </View>

        {/* buttons */}
        {renderDownloadControls()}

        {/* radtio buttons for selection */}
        <View style={{ justifyContent: 'center' }}>
          {activateCheckboxes && (
            <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
          )}
        </View>
      </Pressable>

      {renderProgress()}
    </View>
  );
};

DownloadItem.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.object,
  handleSelectItem: PropTypes.func,
  title: PropTypes.string,
  year: PropTypes.string,
  time: PropTypes.string,
  rating_mpaa: PropTypes.string,
  age_rating: PropTypes.string,
  category: PropTypes.string,
  imageUrl: PropTypes.string,
  isDownloaded: PropTypes.bool,
  progress: PropTypes.number,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func,
  cleanUpDownloadsProgressAction: PropTypes.func,
  downloadsProgress: PropTypes.any
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateDownloadsProgressAction: Creators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: Creators.cleanUpDownloadsProgress
};

const mapStateToProps = (state, props) => {
  const { downloadsProgress } = state.downloads;
  return {
    downloadsProgress,
    // task: selectTask(state, props),
    video: selectVideoForDownloadInfo(state, props)
  };
};

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(DownloadItem);
