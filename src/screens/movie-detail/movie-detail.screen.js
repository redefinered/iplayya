/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, ImageBackground, Dimensions } from 'react-native';
import ContentWrap from 'components/content-wrap.component';
import { Text } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectError, selectIsFetching } from 'modules/ducks/movie/movie.selectors';
import Video from 'react-native-video';

import video from './sample-video.json';

function createFontFormat(fontSize, lineHeight) {
  return { fontSize, lineHeight };
}

const MovieDetailScreen = ({ theme }) => {
  // eslint-disable-next-line no-unused-vars
  const {
    title,
    year,
    description,
    // time,
    rating_mpaa,
    age_rating,
    category,
    director,
    rtsp_url,
    ...otherFields
  } = video;

  const [paused, setPaused] = React.useState(true);

  let player = React.useRef(null);

  console.log({ x: rtsp_url.split(' ') });

  const urlEncodeTitle = (title) => {
    const strsplit = title.split();
    return strsplit.join('+');
  };

  const onBuffer = () => {
    console.log('buffer callback');
  };

  const videoError = () => {
    console.log('video error');
  };

  const handlePlaybackResume = (event) => {
    console.log({ event });
  };

  return (
    <View>
      {/* banner */}
      <View>
        {/* <ImageBackground
          imageStyle={{ width: Dimensions.get('window').width, height: 211 }}
          style={{
            width: '100%',
            height: 211,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          source={{ url: `https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}` }}
        >
          <Icon name="circular-play" size={70} />
        </ImageBackground> */}
        <View
          style={{
            width: '100%',
            height: 211,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Video
            paused={paused}
            // controls
            fullscreenOrientation="landscape"
            source={{ uri: rtsp_url.split(' ')[1] }}
            ref={player}
            onBuffer={() => onBuffer()}
            onError={() => videoError()}
            poster={`https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`}
            style={{ width: Dimensions.get('window').width, height: 211, backgroundColor: 'black' }}
          />
          {paused && (
            <Pressable style={{ position: 'absolute' }} onPress={() => setPaused(false)}>
              <Icon name="circular-play" size={70} />
            </Pressable>
          )}
        </View>
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}-${age_rating}, ${category}`}</Text>
        </ContentWrap>
      </View>

      {/* content */}
      <ScrollView style={{ height: 300 }}>
        <ContentWrap>
          <Text
            style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}
          >{`${title} (${year})`}</Text>
          <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>{description}</Text>
          <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
            <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}>
              Director{' '}
            </Text>
            {director}
          </Text>
          {Object.keys(otherFields).map((key) => (
            <Text key={key} style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
              <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}>
                {key}{' '}
              </Text>
              {otherFields[key]}
            </Text>
          ))}
          <Pressable style={styles.settingItem} onPress={() => setPaused(false)}>
            <View style={styles.iconContainer}>
              <Icon name="circular-play" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Play movie</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="watch" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Watch trailer</Text>
            </View>
          </Pressable>
        </ContentWrap>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching
});

export default compose(withHeaderPush(), connect(mapStateToProps), withTheme)(MovieDetailScreen);
