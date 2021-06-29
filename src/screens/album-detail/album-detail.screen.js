/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Button from 'components/button/button.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import ContentWrap from 'components/content-wrap.component';
import { Creators } from 'modules/ducks/music/music.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectAlbum,
  selectNowPlaying,
  selectIsBackgroundMode,
  selectNowPlayingLayoutInfo
} from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import Icon from 'components/icon/icon.component';
import { compose } from 'redux';

const coverplaceholder = require('assets/imusic-placeholder.png');

const styles = StyleSheet.create({
  root: { flex: 1 },
  cover: {
    width: 148,
    height: 148,
    borderRadius: 8
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  artist: {
    fontSize: 16
  }
});

const AlbumDetail = ({
  // eslint-disable-next-line no-unused-vars
  navigation,
  route,
  album,
  getAlbumAction,
  isBackgroundMode,
  setNowPlayingAction,
  nowPlaying,
  // setNowPlayingBackgroundModeAction,
  nowPlayingLayoutInfo,
  setShuffleOnAction,
  setShuffleOffAction,
  setProgressAction
}) => {
  const theme = useTheme();
  const { album: albumData } = route.params;

  // const [totalDuration, setTotalDuration] = React.useState(0);

  // React.useEffect(() => {
  //   setNowPlayingBackgroundModeAction(false);

  //   return () => setNowPlayingBackgroundModeAction(true);
  // }, []);

  React.useEffect(() => {
    if (albumData) getAlbumAction(albumData);
  }, [albumData]);

  const handleSelectItem = (item) => {
    setShuffleOffAction();

    const { number, name: title, url: source, performer: artist } = item;

    setProgressAction(0);

    setNowPlayingAction(
      {
        number: parseInt(number),
        title,
        artist,
        source,
        thumbnail: coverplaceholder
      },
      true
    );
  };

  const renderBottomPadding = () => {
    if (isBackgroundMode) return;
    if (!nowPlayingLayoutInfo) return;
    if (!nowPlaying) return;

    return (
      <View style={{ width: nowPlayingLayoutInfo.width, height: nowPlayingLayoutInfo.height }} />
    );
  };

  const handleShufflePlay = () => {
    setShuffleOnAction();

    setNowPlayingAction(null, true); // select a random track from album
  };

  if (!album) return <View />;

  return (
    <View style={styles.root}>
      <ContentWrap style={{ flexDirection: 'row', marginBottom: theme.spacing(2) }}>
        <Image style={styles.cover} source={coverplaceholder} />
        <View style={{ flex: 1, paddingLeft: theme.spacing(2), justifyContent: 'space-between' }}>
          <View style={{ marginTop: theme.spacing(1) }}>
            <Text style={{ marginBottom: theme.spacing(1), ...styles.albumName }}>
              {album.name}
            </Text>
            <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...styles.artist }}>
              {album.performer}
            </Text>
          </View>
          <View style={{ marginBottom: theme.spacing(1) }}>
            <Text style={{ fontSize: 14, color: theme.iplayya.colors.white50 }}>
              {`${album.tracks.length} Songs • 56:07 min`}
            </Text>
            <Text
              style={{ fontSize: 14, color: theme.iplayya.colors.white50 }}
            >{`Released ${album.year}`}</Text>
          </View>
        </View>
      </ContentWrap>

      <ContentWrap style={{ marginBottom: theme.spacing(2) }}>
        <Button mode="contained" onPress={handleShufflePlay}>
          <Icon name="shuffle" size={20} />
          <View style={{ width: theme.spacing(1) }} />
          <Text style={{ fontWeight: 'bold' }}>Shuffle Play</Text>
        </Button>
      </ContentWrap>

      <ScrollView>
        {album.tracks.map(({ name, number, ...rest }) => (
          <TouchableRipple key={number} onPress={() => handleSelectItem({ number, name, ...rest })}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: theme.spacing(2),
                paddingVertical: theme.spacing(1)
              }}
            >
              <Image source={coverplaceholder} style={{ width: 40, height: 40 }} />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingVertical: 3,
                  paddingLeft: theme.spacing(1)
                }}
              >
                <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{name}</Text>
                <Text style={{ fontSize: 12, color: theme.iplayya.colors.white50 }}>
                  {`${album.performer} • 4:04 min`}
                </Text>
              </View>
            </View>
          </TouchableRipple>
        ))}
        {renderBottomPadding()}
      </ScrollView>
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <AlbumDetail {...props} />
  </ScreenContainer>
);

const actions = {
  getAlbumStartAction: Creators.getAlbumStart,
  getAlbumAction: Creators.getAlbum,
  setNowPlayingAction: Creators.setNowPlaying,
  setNowPlayingBackgroundModeAction: Creators.setNowPlayingBackgroundMode,
  setShuffleOnAction: Creators.setShuffleOn,
  setShuffleOffAction: Creators.setShuffleOff,
  setProgressAction: Creators.setProgress
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  album: selectAlbum,
  nowPlaying: selectNowPlaying,
  isBackgroundMode: selectIsBackgroundMode,
  nowPlayingLayoutInfo: selectNowPlayingLayoutInfo
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
