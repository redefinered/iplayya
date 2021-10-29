import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import theme from 'common/theme';

const PlayMovieButton = ({ setPaused }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      style={{
        backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent',
        ...styles.settingItem
      }}
      onPress={() => setPaused(false)}
    >
      <View style={styles.iconContainer}>
        <Icon name="circular-play" size={theme.iconSize(3)} />
      </View>
      <View>
        <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Play movie</Text>
      </View>
    </Pressable>
  );
};

PlayMovieButton.propTypes = {
  setPaused: PropTypes.func
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: theme.spacing(2)
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

export default React.memo(PlayMovieButton);
