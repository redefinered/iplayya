import React from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import MediaPlayer from 'components/media-player/media-player.component';
import theme from 'common/theme';

// eslint-disable-next-line react/prop-types
const IplayDetailScreen = ({ route }) => {
  const { file } = route.params;

  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    // navigation.setOptions({ headerShown: false });
  }, []);

  const [paused, setPaused] = React.useState(false);

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  const { name, fileCopyUri } = file;

  return (
    <View
      // style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.iplayya.colors.goodnight }}
      style={
        {
          // flex: 1,
          // backgroundColor: theme.iplayya.colors.goodnight
          // alignItems: 'center',
          // justifyContent: 'center'
        }
      }
    >
      {/* <StatusBar hidden /> */}
      <MediaPlayer
        containerStyle={{ backgroundColor: 'red' }}
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

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IplayDetailScreen {...props} />
  </ScreenContainer>
);

// export default IplayDetailScreen;
export default Container;
