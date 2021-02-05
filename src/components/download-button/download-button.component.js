import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RNFetchBlob from 'rn-fetch-blob';

let dirs = RNFetchBlob.fs.dirs;

const DownloadButton = ({
  theme,
  isMovieDownloaded,
  setIsMovieDownloaded,
  handleDownloadMovie,
  videoId,
  movieTitle,
  movieUrl
}) => {
  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    checkIfMovieIsDownlowded();
  }, []);

  const checkIfMovieIsDownlowded = async () => {
    const dir = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const ls = await RNFetchBlob.fs.ls(dir);
    const dls = ls.map((file) => {
      let split = file.split('_');
      return split[0]; // this is the ID
    });
    setFiles(dls);
  };

  React.useEffect(() => {
    console.log({ files });
    if (files.length) {
      const check = files.find((f) => f === videoId);
      if (typeof check !== 'undefined') {
        setIsMovieDownloaded(true);
      } else {
        setIsMovieDownloaded(false);
      }
    }
  }, [files]);

  return (
    <Pressable
      onPress={() => handleDownloadMovie({ videoId, title: movieTitle, url: movieUrl })}
      style={styles.headerButtonContainer}
    >
      <Icon
        name="download"
        size={24}
        color={isMovieDownloaded ? theme.iplayya.colors.vibrantpussy : 'white'}
      />
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
  isMovieDownloaded: PropTypes.bool,
  setIsMovieDownloaded: PropTypes.func,
  handleDownloadMovie: PropTypes.func,
  videoId: PropTypes.string,
  movieUrl: PropTypes.string,
  movieTitle: PropTypes.string
};

export default withTheme(DownloadButton);
