/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import GoogleCast, { useCastSession } from 'react-native-google-cast';
import ButtonIconDefault from 'components/button-icon-default/button-icon-default.component';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMovie } from 'modules/ducks/movies/movies.selectors';
import { selectChannel } from 'modules/ducks/itv/itv.selectors';
import { AirplayButton, useExternalPlaybackAvailability } from 'react-airplay';
import { useIsFocused } from '@react-navigation/native';
import theme from 'common/theme';

const ChromecastButton = ({ onPressAction, stopCastingAction }) => {
  const isScreenFocused = useIsFocused();
  const isExternalPlaybackAvailable = useExternalPlaybackAvailability({
    useCachedValue: !isScreenFocused
  });

  const castSession = useCastSession();

  const [castConnected, setCastConnected] = React.useState(false);

  const handlePressActionPress = () => {
    onPressAction();
  };

  const handleStopCastingPress = () => {
    stopCastingAction();
  };

  React.useEffect(() => {
    const castListener = GoogleCast.onCastStateChanged((castState) => {
      if (castState === 'connected') setCastConnected(true);
      if (castState === 'notConnected') setCastConnected(false);
      // 'noDevicesAvailable' | 'notConnected' | 'connecting' | 'connected'
    });

    return () => castListener.remove();
  }, []);

  const renderAirplayButton = () => {
    if (Platform.OS === 'android') return;

    if (isExternalPlaybackAvailable) {
      return (
        <AirplayButton
          prioritizesVideoDevices={true}
          tintColor="white"
          activeTintColor={theme.iplayya.colors.vibrantpussy}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        />
      );
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* {castSession && (
        <ButtonIconDefault iconName="close" iconSize={3} pressAction={handleStopCastingPress} />
      )} */}
      <ButtonIconDefault
        iconName={castConnected ? 'cast-connected' : 'cast'}
        iconSize={3}
        pressAction={castSession ? handleStopCastingPress : handlePressActionPress}
      />
      {renderAirplayButton()}
    </View>
  );
};

ChromecastButton.propTypes = {
  movie: PropTypes.object,
  source: PropTypes.string,
  paused: PropTypes.bool,
  seriesTitle: PropTypes.string
};

const mapStateToProps = createStructuredSelector({ movie: selectMovie, channel: selectChannel });

export default connect(mapStateToProps)(ChromecastButton);
