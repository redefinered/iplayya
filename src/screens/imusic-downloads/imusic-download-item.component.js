import React from 'react';
// import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';

const ImusicDownloadItem = ({ item }) => {
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  const renderProgress = () => {
    if (isDownloaded) return;
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  return <View style={[(flex: 1)]}></View>;
};

export default ImusicDownloadItem;
