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
  listDownloadedFiles,
  checkExistingDownloads
} from 'services/imovie-downloads.service';
import { createFontFormat, downloadPath } from 'utils';
import clone from 'lodash/clone';
import uniqBy from 'lodash/uniqBy';

const ITEM_HEIGHT = 144;

const createFilename = (track) => {
  const { id, title } = track;

  // convert spaces to underscores
  const tsplit = title.split();
  const tjoin = tsplit.join('_');

  return `${id}_${tjoin}`;
};

const createDownloadConfig = ({ id, title, url }) => {
  const filename = createFilename({ id, title });

  return { id, url, destination: `${downloadPath}/${filename}` };
};

const ImusicDownloads = ({
  theme,
  navigation,
  downloads,
  downloadStartAction,
  downloadsProgress,
  updateDownloadsAction,
  downloadStartedAction,
  updateDownloadsProgressAction,
  removeDownloadsByIdsAction,
  cleanUpDownloadsProgressAction,
  downloadStartFailureAction
}) => {
  const [list, setList] = React.useState([]);
  const [activeDownloads, setActiveDownloads] = React.useState([]);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);

  /**
   * downloads a track
   * @param {Object} track contains id, title, url, is_series, currentEpisode properties that are required for the download aciton
   * @returns void
   */
  const executeDownload = React.useCallback((downloadObj) => {
    const { id, url, track } = downloadObj;

    // return if there is no available source to download
    if (typeof url === 'undefined') {
      console.log('no source');
      return;
    }

    try {
      let config = createDownloadConfig(track);

      let task = RNBackgroundDownloader.download(config)
        .begin((expectedBytes) => {
          console.log(`Going to download ${expectedBytes} bytes!`);
          downloadStartedAction();
        })
        .progress((percent) => {
          updateDownloadsProgressAction({ id, progress: percent * 100 });
        })
        .done(() => {
          console.log('Download is done!');

          updateDownloadsProgressAction({ id, progress: 100 });

          let completedItems = downloadsProgress.filter(
            ({ received, total }) => received === total
          );
          completedItems = completedItems.map(({ id }) => id);

          cleanUpDownloadsProgressAction([track.id, ...completedItems]);
        })
        .error((error) => {
          console.log('Download canceled due to error: ', error);
          downloadStartFailureAction(error.message);
        });

      updateDownloadsAction({
        id,
        url,
        task,
        track
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  React.useEffect(() => {
    downloadStartAction();
    setUpDownloadsList(downloads);
    listDownloadedFiles();
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
            movie: { title }
          } = downloads.find(({ id: downloadId }) => id === downloadId);
          const filename = createFilename({ id, title });
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

      // set active downloads list to get the download tasks
      setActiveDownloads(existingDownloads);

      // add existing download ids to ids array
      const existingDownloadIds = existingDownloads.map(({ id }) => id);

      // add downloaded files ids to ids array
      const downloadedFiles = await RNFetchBlob.fs.ls(downloadPath);

      /// remove downloaded files that are not included in state download list
      // because not doing so, the screen will display items that have undefined info like title and time
      const promises = [];
      for (let i = 0; i < downloadedFiles.length; i++) {
        const d = downloadedFiles[i];
        const downloadId = d.split('_')[0];
        const download = downloads.find(({ id }) => id === downloadId);
        if (typeof download === 'undefined') promises.push(deleteFile(d));
      }
      // const promises = downloadedFiles.map((d) => deleteFile(d));
      await Promise.all(promises);

      const donwloadedFilesIds = downloadedFiles.map((filename) => filename.split('_')[0]);

      ids = [...existingDownloadIds, ...donwloadedFilesIds];

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];

        const download = downloads.find((d) => d.id === id);

        if (typeof download !== 'undefined') {
          const { movie, ep } = download;

          let movieClone = clone(movie);

          /// change the movie id to be the download id from redux state
          data.push(Object.assign(movieClone, { ep }));
        }
      }

      data = uniqBy(data, 'id');

      setList(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleItemSelect = (id) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === id);
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
    let task = activeDownloads.find((d) => d.id === item.id);

    <ImusicDownloadItem
      item={item}
      task={task}
      handleLongPress={handleLongPress}
      executeDownload={executeDownload}
      handleItemSelect={handleItemSelect}
    />;
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
    <View style={{ flex: 1 }}>
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
          message="Are you sure you want to delete this movie/s from your Downloads list?"
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
  updateDownloadsProgressAction: Creators.updateDownloadsProgress,
  cleanUpDownloadsProgressAction: Creators.cleanUpDownloadsProgress,
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
