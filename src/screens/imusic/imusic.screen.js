/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import NowPlaying from 'components/now-playing/now-playing.component';
import RadioButton from 'components/radio-button/radio-button.component';
import Icon from 'components/icon/icon.component';
import Button from 'components/button/button.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import EmptyLibrary from 'assets/imusic-empty-lib.svg';

import { compose } from 'redux';
import { createFontFormat } from 'utils';

import library from './dummy-data.json';

const ImusicScreen = ({ navigation, theme }) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [nowPlaying, setNowPlaying] = React.useState(null);

  const handleSelectItem = (item) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === item);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([item, ...selectedItems]);
      }
    } else {
      let playing = library.find(({ id }) => id === item);
      setNowPlaying(playing);
    }
  };

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      let collection = library.map(({ id }) => {
        return id;
      });
      setSelectedItems(collection);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  const handleSelectAll = () => {
    setSellectAll(!selectAll);
  };

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  console.log({ selectedItems });

  return (
    <View style={styles.container}>
      {library.length ? (
        <ContentWrap>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...createFontFormat(16, 22) }}>Music Library</Text>
            <Pressable>
              <Text
                style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(16, 22) }}
              >
                Add music
              </Text>
            </Pressable>
          </View>
          <Spacer size={35} />

          {activateCheckboxes && (
            <React.Fragment>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="delete" size={24} style={{ marginRight: 10 }} />
                  <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
                </View>
                <Pressable
                  onPress={() => handleSelectAll()}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ marginRight: 10 }}>All</Text>
                  <RadioButton selected={selectedItems.length === library.length} />
                </Pressable>
              </View>

              <Spacer size={30} />
            </React.Fragment>
          )}

          {library.map(({ id, title, artist, thumbnails }) => (
            <Pressable
              key={id}
              onLongPress={() => handleLongPress(id)}
              onPress={() => handleSelectItem(id)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 8, marginRight: 15 }}
                    source={{
                      url: thumbnails.small
                    }}
                  />
                  <View>
                    <Text
                      style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}
                    >
                      {title}
                    </Text>
                    <Text style={{ ...createFontFormat(12, 16) }}>{artist}</Text>
                  </View>
                </View>
                {activateCheckboxes && (
                  <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                )}
              </View>
            </Pressable>
          ))}
        </ContentWrap>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EmptyLibrary />
          <Spacer size={30} />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(20, 27) }}>Lets get started</Text>
          <Spacer size={20} />
          <ContentWrap>
            <Text style={{ textAlign: 'center', ...createFontFormat(14, 19) }}>
              Browse Audio files on your device and start playing music anywhere and anytime you
              are!
            </Text>
            <Spacer size={20} />
            <Button mode="contained">Browse files</Button>
          </ContentWrap>
        </View>
      )}

      {!activateCheckboxes ? (
        <React.Fragment>
          {/* this element pushes the content so the bottom nav does not go over the content */}
          <View style={{ paddingBottom: 100 }} />

          <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
            {nowPlaying && <NowPlaying selected={nowPlaying} navigation={navigation} />}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: '#202530',
                borderTopRightRadius: !nowPlaying ? 24 : 0,
                borderTopLeftRadius: !nowPlaying ? 24 : 0,
                paddingHorizontal: 30,
                paddingTop: 15,
                paddingBottom: 30
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => navigation.replace('HomeScreen')}
                style={{ alignItems: 'center' }}
              >
                <Icon name="iplayya" size={40} />
                <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </React.Fragment>
      ) : null}
    </View>
  );
};

ImusicScreen.propTypes = {
  navigation: PropTypes.object,
  theme: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  }
});

export default compose(
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
)(ImusicScreen);
