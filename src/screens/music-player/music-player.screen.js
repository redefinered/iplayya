import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ContentWrap from 'components/content-wrap.component';
import dummydata from '../imusic/dummy-data.json';
import Icon from 'components/icon/icon.component';
import Slider from '@react-native-community/slider';
import { createFontFormat } from 'utils';
import thumbImage from 'assets/player-thumb-image.png';

import { compose } from 'redux';

const MusicPlayerScreen = ({
  theme: {
    iplayya: { colors }
  },
  route: {
    params: { id }
  }
}) => {
  const [paused, setPaused] = React.useState(true);
  const { title, artist, thumbnails } = dummydata.find((item) => item.id === id);
  return (
    <ContentWrap>
      <View style={{ alignItems: 'center', paddingTop: 70, marginBottom: 30 }}>
        <Image
          style={{ width: 220, height: 220, borderRadius: 8 }}
          source={{ url: thumbnails.large }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable>
          <Icon name="shuffle" size={24} style={{ color: colors.white50 }} />
        </Pressable>
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 15,
              ...createFontFormat(16, 22)
            }}
          >
            {title}
          </Text>
          <Text style={{ textAlign: 'center', ...createFontFormat(16, 22) }}>{artist}</Text>
        </View>
        <Pressable>
          <Icon name="repeat" size={24} style={{ color: colors.white50 }} />
        </Pressable>
      </View>
      <Slider
        value={50}
        style={{ width: '100%', height: 10 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={colors.vibrantpussy}
        maximumTrackTintColor="white"
        thumbImage={thumbImage}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
        <Text style={{ ...createFontFormat(10, 14) }}>1:20</Text>
        <Text style={{ ...createFontFormat(10, 14) }}>-2:40</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable>
          <Icon name="previous" size={40} style={{ color: colors.white25 }} />
        </Pressable>
        <Pressable onPress={() => setPaused(!paused)}>
          <Icon
            name={paused ? 'circular-play' : 'circular-pause'}
            size={80}
            style={{ marginHorizontal: 20 }}
          />
        </Pressable>
        <Pressable>
          <Icon name="next" size={40} />
        </Pressable>
      </View>
    </ContentWrap>
  );
};

MusicPlayerScreen.propTypes = {
  theme: PropTypes.object,
  route: PropTypes.object
};

export default compose(withHeaderPush({ backgroundType: 'solid' }), withTheme)(MusicPlayerScreen);
