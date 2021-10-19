/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import NoDownloads from 'assets/downloads-empty.svg';
import ScreenContainer from 'components/screen-container.component';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import ImusicDownloadItem from './imusic-download-item.component';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/imusic-downloads/imusic-downloads.actions';
import {
  selectError,
  selectIsFetching,
  selectDownloads,
  selectDownloadsProgress
} from 'modules/ducks/imusic-downloads/imusic-downloads.selectors';
import {
  deleteFile,
  // eslint-disable-next-line no-unused-vars
  listDownloadedFiles,
  checkExistingDownloads
} from 'services/imusic-downloads.service';
import { createDownloadConfig } from './imusic-download-button.component';
import { createFontFormat, downloadPath, createFilenameForAudioTrack } from 'utils';
// import clone from 'lodash/clone';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';

const ITEM_HEIGHT = 64;
// listDownloadedFiles();

const ImusicDownloads = ({
  theme,
  navigation,
  downloads,
  downloadStartAction,
  downloadsProgress,
  updateDownloadsAction,
  downloadStartedAction,
  updateProgressAction,
  removeDownloadsByIdsAction,
  cleanUpProgressAction,
  downloadStartFailureAction
}) => {
  const [list, setList] = React.useState([]);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [activeDownloads, setActiveDownloads] = React.useState([]);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);

  const checkIfDownloading = async () => {
    const d = await checkExistingDownloads();
    if (d.length) return setIsDownloading(true);

    return setIsDownloading(false);
  };

  const executeDownload = (track) => {
    const { id, url, albumId } = track;

    const taskId = `a_${id}_${albumId}`;

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    try {
      let config = createDownloadConfig({ taskId, ...track });

      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          downloadStartedAction();
        })
        .progress((percent) => {
          updateProgressAction({ id, progress: percent * 100 });
        })
        .done(() => {
          /// FOR DEVELOPMENT: list downloaded file when a download is finished
          // listDownloadedFiles();

          console.log('Download is done!');

          updateProgressAction({ id, progress: 100 });

          let completedItems = downloadsProgress.filter(({ progress }) => progress === 100);

          completedItems = completedItems.map(({ id }) => id);

          console.log({ completedItems });

          cleanUpProgressAction([track.id, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);
        });

      /// download item in state might need to be updated in the future to make a leaner data
      updateDownloadsAction({
        taskId,
        albumId: track.albumId,
        url,
        task,
        track
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // const executeDownload = React.useCallback((downloadObj) => {
  //   const { id, url, track } = downloadObj;

  //   // return if there is no available source to download
  //   if (typeof url === 'undefined') {
  //     console.log('no source');
  //     return;
  //   }

  //   try {
  //     let config = createDownloadConfig(track);

  //     let task = RNBackgroundDownloader.download(config)
  //       .begin((expectedBytes) => {
  //         console.log(`Going to download ${expectedBytes} bytes!`);
  //         downloadStartedAction();
  //       })
  //       .progress((percent) => {
  //         updateDownloadsProgressAction({ id, progress: percent * 100 });
  //       })
  //       .done(() => {
  //         console.log('Download is done!');

  //         updateDownloadsProgressAction({ id, progress: 100 });

  //         let completedItems = downloadsProgress.filter(
  //           ({ received, total }) => received === total
  //         );
  //         completedItems = completedItems.map(({ id }) => id);

  //         cleanUpDownloadsProgressAction([track.id, ...completedItems]);
  //       })
  //       .error((error) => {
  //         console.log('Download canceled due to error: ', error);
  //         downloadStartFailureAction(error.message);
  //       });

  //     updateDownloadsAction({
  //       id,
  //       url,
  //       task,
  //       track
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }, []);

  React.useEffect(() => {
    checkIfDownloading();

    downloadStartAction();
    setUpDownloadsList(downloads);
  }, []);

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  // remove items form favorites
  const handleRemoveItems = async () => {
    if (selectedItems.length) {
      try {
        let promises = selectedItems.map((id) => {
          const {
            taskId,
            track: { name }
          } = downloads.find(({ taskId, albumId }) => {
            const x = `a_${id}_${albumId}`;

            return taskId === x;
          });

          const filename = createFilenameForAudioTrack({ taskId, name });
          return deleteFile(filename);
        });

        await Promise.all(promises);

        setActivateCheckboxes(false);
        removeDownloadsByIdsAction(selectedItems);

        // setup downloads list
        setUpDownloadsList(downloads);
      } catch (error) {
        console.log('Delete error: ', error.message);
      }
    }
  };

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  const setUpDownloadsList = async (downloads) => {
    try {
      let data = [];
      let ids = [];

      // check for active downloads in the background
      const existingDownloads = await checkExistingDownloads();
      console.log({ existingDownloads });

      // set active downloads list to get the download tasks
      setActiveDownloads(existingDownloads);

      // add existing download ids to ids array
      const existingDownloadIds = existingDownloads.map(({ id }) => id); // e.g. a_37900_2404 which is prefix_trackId_albumId

      // add downloaded files ids to ids array
      const downloadedFiles = await RNFetchBlob.fs.ls(downloadPath);

      // console.log({ downloadedFiles });

      /// remove downloaded files that are not included in state download list
      // because not doing so, the screen will display items that have undefined info like title and time
      const promises = [];
      for (let i = 0; i < downloadedFiles.length; i++) {
        const d = downloadedFiles[i];
        const dsplit = d.split('_');
        // const downloadId = d.split('_')[0];

        /// extract download item's ID from its filename
        const downloadId = `${dsplit[0]}_${dsplit[1]}_${dsplit[2]}`;

        /// check if that download exists in downloads array in redux state
        const download = downloads.find(({ taskId }) => taskId === downloadId);

        if (typeof download === 'undefined') promises.push(deleteFile(d));
      }

      /// delete files
      await Promise.all(promises);

      const donwloadedFilesIds = downloadedFiles.map((filename) => {
        const fsplit = filename.split('_');
        return `${fsplit[0]}_${fsplit[1]}_${fsplit[2]}`;
      });

      ids = [...existingDownloadIds, ...donwloadedFilesIds];

      /// collect
      // for (let i = 0; i < ids.length; i++) {
      //   const id = ids[i];

      //   const download = downloads.find(({ trackId }) => trackId === id);

      //   if (typeof download !== 'undefined') {
      //     const { track } = download;

      //     let trackClone = clone(track);

      //     /// change the movie id to be the download id from redux state
      //     // data.push(Object.assign(trackClone, ));
      //   }
      // }

      // console.log({ ids, downloadedFiles, existingDownloads });

      data = ids.map((id) => {
        const { track } = downloads.find(({ taskId }) => taskId === id);
        return track;
      });

      // make data unique by ID
      data = uniqBy(data, 'id');

      // order by name
      data = orderBy(data, 'name', 'asc');

      setList(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleItemSelect = (id) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === id);

      // console.log({ id, newItems, selectedItems });

      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([id, ...selectedItems]);
      }
    } else {
      /// play music if selected item is a track,
      /// navigate to album group screen if it's an album
    }
  };

  const renderItem = ({ item }) => {
    let selected = false;

    const taskId = `a_${item.id}_${item.albumId}`;

    let task = activeDownloads.find((d) => d.id === taskId);

    let d = selectedItems.find((i) => i === item.id);
    if (typeof d !== 'undefined') selected = true;

    return (
      <ImusicDownloadItem
        item={item}
        task={task}
        selected={selected}
        showRadioButton={activateCheckboxes}
        longPressAction={handleLongPress}
        executeDownload={executeDownload}
        handleItemSelect={handleItemSelect}
      />
    );
  };

  const renderMain = () => {
    if (list.length)
      return (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          getItemLayout={(data, index) => {
            return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
          }}
          renderItem={renderItem}
        />
      );

    if (isDownloading) return <View />;
    return <EmptyState theme={theme} navigation={navigation} />;
  };

  React.useEffect(() => {
    if (selectAll) {
      let collection = list.map(({ id }) => {
        return id;
      });
      setSelectedItems(collection);
    } else {
      setSelectedItems([]);
    }
  }, [list, selectAll]);

  const handleSelectAll = () => {
    setSellectAll(!selectAll);
  };

  return (
    <View style={{ flex: 1, paddingTop: theme.spacing(2) }}>
      {activateCheckboxes && (
        <ContentWrap>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Pressable
              onPress={() => setShowDeleteConfirmation(true)}
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
              <RadioButton selected={selectedItems.length === list.length} />
            </Pressable>
          </View>

          <Spacer size={30} />
        </ContentWrap>
      )}

      {renderMain()}

      {showDeleteConfirmation && (
        <AlertModal
          variant="danger"
          message="Are you sure you want to delete this music/s from your Downloads list?"
          visible={showDeleteConfirmation}
          onCancel={handleHideConfirmDeleteModal}
          hideAction={handleHideConfirmDeleteModal}
          confirmText="Delete"
          confirmAction={handleConfirmDelete}
        />
      )}
    </View>
  );
};

const EmptyState = ({ theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    <NoDownloads />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No downloads yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Your downloaded music will appear here.
      </Text>
    </Pressable>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImusicDownloads {...props} />
  </ScreenContainer>
);

const actions = {
  downloadStartAction: Creators.downloadStart,
  downloadStartedAction: Creators.downloadStarted,
  removeDownloadsByIdsAction: Creators.removeDownloadsByIds,
  updateDownloadsAction: Creators.updateDownloads,
  updateProgressAction: Creators.updateProgress,
  cleanUpProgressAction: Creators.cleanUpProgress,
  downloadStartFailureAction: Creators.downloadStartFailure
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  downloads: selectDownloads,
  downloadsProgress: selectDownloadsProgress
});

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(Container);
