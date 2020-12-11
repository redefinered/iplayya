import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Pressable, Dimensions } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import PlayingAnimationPlaceholder from 'assets/animation-placeholder.svg';
import PausedAnimationPlaceholder from 'assets/paused-animation-placeholder.svg';
import { createFontFormat } from 'utils';

const NowPlaying = ({ theme, selected: { title, artist, thumbnail } }) => {
  const [paused, setPaused] = React.useState(true);
  return (
    <View
      style={{
        backgroundColor: '#202530',
        borderBottomWidth: 1,
        borderColor: theme.iplayya.colors.white10
      }}
    >
      <View style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}>
        <View
          style={{ width: 200, height: 1, backgroundColor: theme.iplayya.colors.vibrantpussy }}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
            source={{
              url: thumbnail
            }}
          />
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}>
              {title}
            </Text>
            <Text style={{ ...createFontFormat(12, 16) }}>{artist}</Text>
          </View>
        </View>
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {paused ? (
            <PausedAnimationPlaceholder style={{ marginHorizontal: 10 }} />
          ) : (
            <PlayingAnimationPlaceholder style={{ marginHorizontal: 10 }} />
          )}

          <Pressable onPress={() => setPaused(!paused)}>
            <Icon
              name={paused ? 'circular-play' : 'circular-pause'}
              size={32}
              style={{ marginHorizontal: 10 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

NowPlaying.propTypes = {
  theme: PropTypes.object,
  selected: PropTypes.object.isRequired
};

export default withTheme(NowPlaying);
