/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import NoDownloads from 'assets/downloads-empty.svg';
import { createFontFormat } from 'utils';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import RadioButton from 'components/radio-button/radio-button.component';
import { selectFavorites } from 'modules/ducks/movies/movies.selectors';
import AlertModal from 'components/alert-modal/alert-modal.component';
import DownloadItem from './download-item.component';
import { Creators } from 'modules/ducks/downloads/downloads.actions';
import { deleteFile, listDownloadedFiles, checkExistingDownloads } from 'services/download.service';
import { getFilename } from 'utils';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';
import uniq from 'lodash/uniq';
import {
  selectError,
  selectIsFetching,
  selectDownloads,
  selectDownloadsProgress,
  selectDownloadsData
} from 'modules/ducks/downloads/downloads.selectors';

// eslint-disable-next-line no-unused-vars
const ImovieDownloadsScreen = ({
  theme,
  navigation,
  // route,
  downloadsProgress,
  getDownloadsAction,
  downloadsData,

  downloads,
  removeDownloadsDataByIdsAction,
  downloadStartAction
}) => {
  // const [ids, setIds] = React.useState([]);
  // const [donwloadingItems, setDownloadingItems] = React.useState([]);
  const [activeDownloads, setActiveDownloads] = React.useState([]);

  const [list, setList] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);

  React.useEffect(() => {
    downloadStartAction();
    setUpDownloadsList(downloads);
    listDownloadedFiles();
  }, []);

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      let collection = downloadsData.map(({ id }) => {
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

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  // remove items form favorites
  const handleRemoveItems = async () => {
    if (selectedItems.length) {
      try {
        let promises = selectedItems.map((id) => {
          const { title } = downloadsData.find(({ id: downloadId }) => id === downloadId);
          const filename = getFilename({ videoId: id, title });
          return deleteFile(filename);
        });

        await Promise.all(promises);

        setActivateCheckboxes(false);
        removeDownloadsDataByIdsAction(selectedItems);
      } catch (error) {
        console.log('Delete files action error', error.message);
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
      ids = [...existingDownloadIds];

      // add downloaded files ids to ids array
      const donwloadedFiles = await RNFetchBlob.fs.ls(downloadPath);
      const donwloadedFilesIds = donwloadedFiles.map((filename) => filename.split('_')[0]);
      ids = [...existingDownloadIds, ...donwloadedFilesIds];

      data = ids.map((id) => {
        return downloads.find((d) => d.id === id).movie;
      });

      data = uniq(data);

      console.log({ data });

      setList(data);
    } catch (error) {
      console.log({ error });
    }
  };

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
      navigation.navigate('MovieDetailDownloadedScreen', {
        movie: downloads.find((v) => v.id === item).movie
      });
    }
  };

  const renderMain = () => {
    if (list.length)
      return (
        <ScrollView>
          {list.map(({ id, thumbnail, ...otherProps }) => {
            let imageUrl = thumbnail ? thumbnail : 'http://via.placeholder.com/65x96.png';

            let progress = null;

            if (downloadsProgress.length) {
              let progressData = downloadsProgress.filter(
                ({ id: progressId }) => id === progressId
              );

              let currentProgress = progressData[progressData.length - 1];

              if (typeof currentProgress !== 'undefined') {
                // progress = currentProgress.received / currentProgress.total;
                progress = currentProgress.progress;
              }
            }

            let task = activeDownloads.find((d) => d.id === id);

            return (
              <DownloadItem
                key={id}
                id={id}
                progress={progress}
                imageUrl={imageUrl}
                handleSelectItem={handleSelectItem}
                task={task}
                handleLongPress={handleLongPress}
                activateCheckboxes={activateCheckboxes}
                selectedItems={selectedItems}
                {...otherProps}
              />
            );
          })}
          {/* <Spacer size={100} /> */}
        </ScrollView>
      );
    return <EmptyState theme={theme} navigation={navigation} />;
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
              <Icon name="delete" size={24} style={{ marginRight: 10 }} />
              <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSelectAll()}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={{ marginRight: 10 }}>All</Text>
              <RadioButton selected={selectedItems.length === downloadsData.length} />
            </Pressable>
          </View>

          <Spacer size={30} />
        </ContentWrap>
      )}
      {renderMain()}
      {/* <ImovieBottomTabs navigation={navigation} route={route} /> */}

      {showDeleteConfirmation && (
        <AlertModal
          variant="danger"
          message={`Are you sure you want to delete ${
            selectedItems.length > 1 ? 'these' : 'this'
          } items in your download list?`}
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
        Your downloaded movies will appear here.
      </Text>
    </Pressable>
  </View>
);

const actions = {
  getDownloadsAction: Creators.getDownloads,
  removeDownloadsDataByIdsAction: Creators.removeDownloadsDataByIds,
  downloadStartAction: Creators.downloadStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  downloads: selectDownloads,
  favorites: selectFavorites,
  downloadsProgress: selectDownloadsProgress,
  downloadsData: selectDownloadsData
});

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
);

export default enhance(ImovieDownloadsScreen);
