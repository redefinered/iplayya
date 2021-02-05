/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import MediaPlayer from 'components/media-player/media-player.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ProgramGuide from './program-guide.component';

import { createFontFormat, urlEncodeTitle } from 'utils';

const SportChanelDetail = () => {
  const [paused, setPaused] = React.useState(true);

  const isFavorite = false;

  // const { rtsp_url } = sampledata.data.videos.find(({ id }) => id === '24969');
  const rtsp_url = 'ffmpeg http://212.102.38.19:80/13774202158/500Days.mp4';

  const data = {
    id: 6,
    title: 'The Past and The Furriest 8',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  };

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  const handleFovoritePress = () => {
    console.log('add to favorites');
  };

  return (
    <View>
      {/* Player */}
      <View
        style={{
          width: '100%',
          height: 211,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MediaPlayer
          paused={paused}
          source={rtsp_url.split(' ')[1]}
          thumbnail={data.thumbnail}
          title={data.title}
          togglePlay={handleTogglePlay}
        />
      </View>
      <ScrollView>
        <ContentWrap>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20
            }}
          >
            <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                source={{
                  url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(data.title)}`
                }}
              />
              <Content {...data} onRightActionPress={handleFovoritePress} isFavorite={isFavorite} />
            </View>
          </View>
        </ContentWrap>
        {/* program guide */}

        <View>
          <ContentWrap>
            <Text style={{ ...createFontFormat(16, 22) }}>Program Guide</Text>
          </ContentWrap>

          <ProgramGuide />
        </View>
      </ScrollView>
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({ title, chanel, time, onRightActionPress, isFavorite }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{title}</Text>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon
            name="heart-solid"
            size={24}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </View>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {chanel}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>{time}</Text>
          <Icon name="history" color="#13BD38" />
        </View>
      </View>
    </View>
  );
};

// eslint-disable-next-line react/prop-types
const CategoryPill = ({ id, name, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      key={id}
      onPress={() => onSelect(id)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: 34,
        borderRadius: 34,
        marginRight: 10,
        marginBottom: 30
      }}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{name}</Text>
    </Pressable>
  );
};

CategoryPill.defaultProps = {
  selected: '1'
};

export default withHeaderPush({ backgroundType: 'solid' })(SportChanelDetail);
