import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import { createFontFormat } from 'utils';
import clone from 'lodash/clone';
import uniqBy from 'lodash/uniqBy';
import RNFetchBlob from 'rn-fetch-blob';
import theme from 'common/theme';

const ImusicDownloads = () => {
  const [list, setList] = React.useState([]);
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);

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
    </View>
  );
};

export default ImusicDownloads;
