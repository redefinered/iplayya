import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MediaPlayer from 'components/media-player/media-player.component';
import { useTheme } from 'react-native-paper';

const IplayDetailScreen = ({ route }) => {
  const theme = useTheme();
  const { file } = route.params;

  const [paused, setPaused] = React.useState(true);

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  const { name, fileCopyUri } = file;

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.iplayya.colors.goodnight }}
    >
      <MediaPlayer
        // videoplayer="vlc"
        paused={paused}
        source={fileCopyUri}
        title={name}
        togglePlay={handleTogglePlay}
        setPaused={setPaused}
      />
    </View>
  );
};

IplayDetailScreen.propTypes = {
  route: PropTypes.object
};

export default IplayDetailScreen;
