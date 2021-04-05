import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RNFetchBlob from 'rn-fetch-blob';
import {
  selectDownloads,
  selectChannelUrl,
  selectChannelName
} from 'modules/ducks/itv/itv.selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';

let dirs = RNFetchBlob.fs.dirs;

const DownloadButton = ({
  theme,
  channelId,

  channelName,

  downloads,
  updateDownloadsProgressAction,
  updateDownloadsAction
}) => {
  const [files, setFiles] = React.useState([]);
  const [downloading, setDownloading] = React.useState(false);
  const [isChannelDownloaded, setIsChannelDownloaded] = React.useState(false);

  React.useEffect(() => {
    // console.log({ archived_link, channelUrl, channelName });
    checkIfMovieIsDownlowded();
  }, []);

  const handleDownloadChannel = (channel) => {
    if (downloading) return;

    const { url, title: channelName, channelId } = channel;

    // return if movie is already downloaded
    if (isChannelDownloaded) {
      console.log('already downloaded');
      return;
    }

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    // set downloading state to true
    setDownloading(true);

    try {
      const titlesplit = channelName.split(' ');
      const title = titlesplit.join('_');
      console.log(title);

      const currentDownloads = downloads;
      currentDownloads[`task_${channelId}`] = {
        id: channelId,
        task: RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          fileCache: true,
          path: `${dirs.DocumentDir}/${channelId}_${title}.mp4`
          // path: `${dirs.DocumentDir}/video.m3u8`
        })
          .fetch('GET', url, {
            //some headers ..
          })
          .progress({ count: 100 }, (received, total) => {
            const progress = received / total;
            updateDownloadsProgressAction({ id: channelId, received, total });
            console.log('progress', progress);
          })
          .then((res) => {
            // the temp file path
            console.log('The file saved to ', res.path());

            // set downloading state to false
            setDownloading(false);
          })
          .catch((error) => {
            // throw new Error(error.message);
            console.log({ error });
          }),
        status: 'in-prgress'
      };

      // setDownloads(Object.assign(downloads, currentDownloads));
      updateDownloadsAction(Object.assign(downloads, currentDownloads));
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkIfMovieIsDownlowded = async () => {
    // const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const dir = dirs.DocumentDir;
    const ls = await RNFetchBlob.fs.ls(dir);
    const dls = ls.map((file) => {
      let split = file.split('_');
      return split[0]; // this is the ID
    });
    setFiles(dls);
  };

  React.useEffect(() => {
    // console.log({ files });
    if (files.length) {
      const check = files.find((f) => f === channelId);
      if (typeof check !== 'undefined') {
        setIsChannelDownloaded(true);
      } else {
        setIsChannelDownloaded(false);
      }
    }
  }, [files]);

  return (
    <Pressable
      // onPress={() => handleDownloadChannel({ channelId, title: channelName, url: archived_link })}
      onPress={() =>
        handleDownloadChannel({
          channelId,
          title: channelName,
          url: 'http://mydvr220.freeddns.org:80/85/video.m3u8'
        })
      }
      style={styles.headerButtonContainer}
      disabled /// disable temporarily
    >
      {downloading ? (
        <ActivityIndicator />
      ) : (
        <Icon
          name="download"
          size={24}
          // color={isChannelDownloaded ? theme.iplayya.colors.vibrantpussy : 'white'}
          color={theme.iplayya.colors.white25} /// disable temporarily
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
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

DownloadButton.propTypes = {
  theme: PropTypes.object,
  handleDownloadMovie: PropTypes.func,
  channelId: PropTypes.string,
  channelUrl: PropTypes.string,
  channelName: PropTypes.string,
  downloads: PropTypes.object,
  updateDownloadsAction: PropTypes.func,
  updateDownloadsProgressAction: PropTypes.func
};

const actions = {
  updateDownloadsAction: Creators.updateDownloads,
  updateDownloadsProgressAction: Creators.updateDownloadsProgress
};

const mapStateToProps = createStructuredSelector({
  downloads: selectDownloads,
  channelUrl: selectChannelUrl,
  channelName: selectChannelName
});

export default compose(connect(mapStateToProps, actions), withTheme)(DownloadButton);
