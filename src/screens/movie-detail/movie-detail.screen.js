/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Dimensions, Modal } from 'react-native';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectMovie,
  selectPlaybackInfo
} from 'modules/ducks/movies/movies.selectors';
import { createFontFormat } from 'utils';

const MovieDetailScreen = ({
  playbackInfo,
  movie,
  theme,
  playbackStartAction,
  getMovieAction,
  getMovieStartAction,
  route: {
    params: { videoId }
  }
}) => {
  const [paused, setPaused] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    playbackStartAction();
    getMovieStartAction();
    getMovieAction(videoId);
  }, []);

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  if (!movie)
    return (
      <ContentWrap>
        <Text>Wait lang beh...</Text>
      </ContentWrap>
    );

  const {
    title,
    year,
    description,
    time,
    rating_mpaa,
    age_rating,
    category,
    director,
    rtsp_url,
    thumbnail,
    ...otherFields
  } = movie;

  // console.log({ rtsp_url, playbackInfo });

  return (
    <View>
      {/* Player */}
      <View>
        <Pressable
          onPress={() => handleTogglePlay()}
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
            thumbnail={thumbnail}
            title={title}
            togglePlay={handleTogglePlay}
            loading={loading}
            setLoading={setLoading}
          />
        </Pressable>
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}. ${category}`}</Text>
        </ContentWrap>
      </View>

      {/* content */}
      <ScrollView style={{ height: 300 }}>
        <ContentWrap>
          {/* <Pressable onPress={() => toggleControlVisible()}>
            <Text>toggle control</Text>
          </Pressable> */}
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
          <List.Section>
            <List.Accordion
              title="Read more"
              style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
              titleStyle={{ color: theme.iplayya.colors.strongpussy, marginLeft: -7 }}
            >
              {Object.keys(otherFields).map((key) => (
                <List.Item
                  key={key}
                  titleStyle={{ marginBottom: -10 }}
                  title={
                    <Text style={{ ...createFontFormat(14, 20) }}>
                      <Text
                        style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}
                      >
                        {key}{' '}
                      </Text>
                      {otherFields[key]}
                    </Text>
                  }
                />
              ))}
            </List.Accordion>
          </List.Section>

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
  },
  controls: {
    position: 'absolute'
  }
});

const actions = {
  getMovieAction: Creators.getMovie,
  getMovieStartAction: Creators.getMovieStart,
  playbackStartAction: Creators.playbackStart,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movie: selectMovie,
  playbackInfo: selectPlaybackInfo
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(MovieDetailScreen);
