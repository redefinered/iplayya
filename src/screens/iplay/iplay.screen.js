/* eslint-disable no-unused-vars */

import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RadioButton from 'components/radio-button/radio-button.component';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import EmptyLibrary from 'assets/iplay-empty-lib.svg';

import { compose } from 'redux';
import { createFontFormat } from 'utils';

import library from './dummy-data.json';

const IplayScreen = ({ navigation, theme }) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [alertMessageVisible, setAlertMessageVisible] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState('');
  const [videoErrorVisible, setVideoErrorVisible] = React.useState(true);

  console.log({ selectedItems, library });

  const handleSelectItem = (item) => {
    const newItems = selectedItems;
    const index = selectedItems.findIndex((i) => i === item);
    if (index >= 0) {
      newItems.splice(index, 1);
      setSelectedItems([...newItems]);
    } else {
      setSelectedItems([item, ...selectedItems]);
    }
  };

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }

    if (selectedItems.length === library.length) {
      setDeleteMessage('Are you sure you want to delete all videos in your library list?');
    } else {
      setDeleteMessage('Are you sure you want to delete these videos in your library?');
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

  const handleShowAlertMessage = () => {
    setAlertMessageVisible(true);
  };

  const handleHideAlertMessage = () => {
    setAlertMessageVisible(false);
  };

  const handleConfirmAction = () => {
    console.log('confirm delete');
    setAlertMessageVisible(false);
  };

  const handleVideoErrorRetry = () => {
    console.log('confirm action');
    setVideoErrorVisible(false);
  };

  const handleHideVideoError = () => {
    setVideoErrorVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* <Text>asdasd</Text> */}
      {library.length ? (
        <ContentWrap>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...createFontFormat(16, 22) }}>Video Library</Text>
            <Pressable>
              <Text
                style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(16, 22) }}
              >
                Add video
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
                <Pressable
                  onPress={() => handleShowAlertMessage()}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Icon name="delete" size={24} style={{ marginRight: 10 }} />
                  <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
                </Pressable>
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

          {library.map(({ id, title, size }) => (
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
                <View>
                  <Text
                    style={{ fontWeight: 'bold', marginBottom: 5, ...createFontFormat(12, 16) }}
                  >
                    {title}
                  </Text>
                  <Text style={{ ...createFontFormat(12, 16) }}>{`${size} mb`}</Text>
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
          <Text style={{ fontWeight: 'bold', ...createFontFormat(20, 27) }}>Lets get started!</Text>
          <Spacer size={20} />
          <ContentWrap>
            <Text style={{ textAlign: 'center', ...createFontFormat(14, 19) }}>
              Lorem ipsum keme keme keme 48 years wasok dites sangkatuts chapter na ang na wrangler
            </Text>
            <Spacer size={20} />
            <Button mode="contained">Browse files</Button>
          </ContentWrap>
        </View>
      )}

      <React.Fragment>
        <View style={{ paddingBottom: 100 }} />

        <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#202530',
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              paddingHorizontal: 15,
              paddingTop: 10,
              paddingBottom: 10,
              position: 'absolute',
              width: '100%',
              bottom: 0
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => navigation.replace('HomeScreen')}
              style={{ alignItems: 'center' }}
            >
              <Icon name="iplayya" size={24} />
              <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </React.Fragment>

      <AlertModal
        visible={alertMessageVisible}
        hideAction={handleHideAlertMessage}
        confirmText="Delete"
        confirmAction={handleConfirmAction}
        onCancel={handleHideAlertMessage}
        message={deleteMessage}
        variant="confirmation"
      />
      <AlertModal
        visible={videoErrorVisible}
        hideAction={handleHideVideoError}
        confirmText="Retry"
        confirmAction={handleVideoErrorRetry}
        message="The audio file is not supported, please select .mp3 or .mp4 format."
        variant="danger"
      />
    </View>
  );
};

IplayScreen.propTypes = {
  navigation: PropTypes.object,
  theme: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15
  }
});

export default compose(
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
)(IplayScreen);
// export default withHeaderPush({ backgroundType: 'solid' })(IplayScreen);
// import { Text } from 'react-native';
// export default function Test() {
//   return <Text>asdasd</Text>;
// }
