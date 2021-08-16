/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import RadioButton from 'components/radio-button/radio-button.component';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import ScreenContainer from 'components/screen-container.component';
import EmptyLibrary from 'assets/iplay-empty-lib.svg';
import { compose } from 'redux';
import { createFontFormat } from 'utils';
import DocumentPicker from 'react-native-document-picker';
import uuid from 'react-uuid';
import { Creators } from 'modules/ducks/iplay/iplay.actions';
import { connect } from 'react-redux';
import { selectVideoFiles } from 'modules/ducks/iplay/iplay.selectors';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import RNFetchBlob from 'rn-fetch-blob';
import withLoader from 'components/with-loader.component';
import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';

const IplayScreen = ({
  navigation,
  addVideoFilesAction,
  videoFiles,
  deleteVideoFilesAction,
  enableSwipeAction,
  route: { params }
}) => {
  const theme = useTheme();
  // console.log({ videoFiles });

  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [alertMessageVisible, setAlertMessageVisible] = React.useState(false);
  const [deleteMessage, setDeleteMessage] = React.useState('');
  const [videoErrorVisible, setVideoErrorVisible] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);
  const [showStepTwo, setShowStepTwo] = React.useState(false);

  const pickFiles = async () => {
    setLoading(true);

    const newFiles = [];
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        mode: 'import',
        type: [DocumentPicker.types.video],
        copyTo: 'documentDirectory'
      });
      for (const result of results) {
        console.log({ result });
        newFiles.push({ id: uuid(), ...result });
      }

      setLoading(false);

      addVideoFilesAction([...newFiles]);
      // setFiles([...newFiles, ...files]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const handleSelectItem = ({ id, ...rest }) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === id);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([id, ...selectedItems]);
      }
      return;
    }

    return navigation.push('IplayDetailScreen', { file: { id, ...rest } });
  };

  const handleDeleteItems = async (fileIds) => {
    try {
      const paths = fileIds.map((id) => videoFiles.find((f) => f.id === id));
      const promises = paths.map(({ fileCopyUri }) => RNFetchBlob.fs.unlink(fileCopyUri));

      // wait all promises to be fulfilled...
      // even if they are meant to be broken
      await Promise.all(promises);

      deleteVideoFilesAction(fileIds);
    } catch (error) {
      console.log({ deleteError: error });
      setError(error.message);
    }
  };

  React.useEffect(() => {
    enableSwipeAction(false);
  }, []);

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }

    if (selectedItems.length === videoFiles.length) {
      setDeleteMessage('Are you sure you want to delete all videos in your library list?');
    } else {
      setDeleteMessage('Are you sure you want to delete these videos in your library?');
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      let collection = videoFiles.map(({ id }) => {
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
    handleDeleteItems(selectedItems);
    setActivateCheckboxes(false);
  };

  const handleVideoErrorRetry = () => {
    console.log('confirm action');
    setVideoErrorVisible(false);
  };

  const handleHideVideoError = () => {
    setVideoErrorVisible(false);
  };

  React.useEffect(() => {
    if (params) {
      setShowWalkthroughGuide(params.openIplayGuide);
    }
  }, [params]);

  const handleHideIplayGuide = () => {
    setShowWalkthroughGuide(false);
  };

  const handleShowStepTwo = () => {
    setShowWalkthroughGuide(false);
    setShowStepTwo(true);
  };

  const handleHideStepTwo = () => {
    setShowStepTwo(false);
  };

  if (loading)
    return (
      <ContentWrap>
        <Text>Adding...</Text>
      </ContentWrap>
    );

  return (
    <View style={styles.container}>
      {videoFiles.length ? (
        <React.Fragment>
          <ContentWrap>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...createFontFormat(16, 22) }}>Video Library</Text>
              <Pressable onPress={pickFiles}>
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
                    <Icon name="delete" size={theme.iconSize(3)} style={{ marginRight: 10 }} />
                    <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleSelectAll()}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ marginRight: 10 }}>All</Text>
                    <RadioButton selected={selectedItems.length === videoFiles.length} />
                  </Pressable>
                </View>

                <Spacer size={30} />
              </React.Fragment>
            )}
          </ContentWrap>
          <ContentWrap scrollable>
            {videoFiles.map(({ id, name, size, ...rest }) => {
              const filesize = size / 1e6;
              return (
                <Pressable
                  key={id}
                  onLongPress={() => handleLongPress(id)}
                  onPress={() => handleSelectItem({ id, name, size, ...rest })}
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
                        {name}
                      </Text>
                      <Text style={{ ...createFontFormat(12, 16) }}>{`${filesize.toFixed(
                        1
                      )} mb`}</Text>
                    </View>
                    {activateCheckboxes && (
                      <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ContentWrap>
        </React.Fragment>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 95 // TODO: bottom nav height and header height must be calculated to center the items
          }}
        >
          <EmptyLibrary />
          <Spacer size={30} />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(20, 27) }}>Play Your Video</Text>
          <Spacer size={20} />
          <ContentWrap style={{ maxWidth: '80%' }}>
            <Text style={{ textAlign: 'center', ...createFontFormat(14, 19) }}>
              Add video from your media gallery and play it here on your video library
            </Text>
            <Spacer size={20} />
            <Button mode="contained" onPress={pickFiles}>
              Add video
            </Button>
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
              <Icon name="iplayya" size={theme.iconSize(3)} />
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
        message="The video file is not supported, please select mp4 format."
        variant="danger"
      />
      <WalkThroughGuide
        visible={showWalkthroughGuide}
        hideModal={handleHideIplayGuide}
        nextModal={handleShowStepTwo}
        title="Add video"
        content="Tap here to play videos from your local folder."
        skip="Skip"
        skipValue="- 1 of 2"
        next="Next"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={152}
        bottomPosValue={-42}
        trianglePosition="center"
        containerPosition="center"
        bottomPadding={20}
        rotateArrow="178deg"
      />
      <WalkThroughGuide
        visible={showStepTwo}
        disabled={true}
        nextModal={handleHideStepTwo}
        title="Back to Home"
        content="Tap here to go back to Home."
        skipValue="2 of 2"
        next="Got it"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={152}
        bottomPosValue={-43}
        trianglePosition="center"
        containerPosition="flex-end"
        bottomPadding={75}
        rotateArrow="178deg"
      />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <IplayScreen {...props} />
  </ScreenContainer>
);

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

const actions = {
  addVideoFilesAction: Creators.addVideoFiles,
  deleteVideoFilesAction: Creators.deleteVideoFiles,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const mapStateToProps = createStructuredSelector({ videoFiles: selectVideoFiles });

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
