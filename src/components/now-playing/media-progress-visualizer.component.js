import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { selectPlaybackProgress } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import theme from 'common/theme';

const MediaProgressVisualizer = ({ progress }) => (
  <View style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}>
    <View
      style={{
        width: (progress * Dimensions.get('window').width) / 100,
        height: 1,
        backgroundColor: theme.iplayya.colors.vibrantpussy
      }}
    />
  </View>
);

MediaProgressVisualizer.propTypes = {
  progress: PropTypes.number
};

const mapStateToProps = createStructuredSelector({
  progress: selectPlaybackProgress
});

export default connect(mapStateToProps)(React.memo(MediaProgressVisualizer));
