import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import theme from 'common/theme';

const PlayTrailerButton = ({ playTrailer }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      style={{
        backgroundColor: isPressed ? theme.iplayya.colors.white10 : 'transparent',
        ...styles.settingItem
      }}
      onPress={() => playTrailer(false)}
    >
      <View style={styles.iconContainer}>
        <Icon name="watch" size={theme.iconSize(3)} />
      </View>
      <View>
        <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Watch trailer</Text>
      </View>
    </Pressable>
  );
};

PlayTrailerButton.propTypes = {
  playTrailer: PropTypes.func
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

export default React.memo(PlayTrailerButton);
