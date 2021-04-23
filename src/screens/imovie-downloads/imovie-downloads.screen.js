/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import NoDownloads from 'assets/downloads-empty.svg';
import { createFontFormat } from 'utils';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectFavorites } from 'modules/ducks/movies/movies.selectors';
import {
  selectError,
  selectIsFetching,
  selectDownloads,
  selectDownloadsProgress,
  selectDownloadsData
} from 'modules/ducks/downloads/downloads.selectors';
import DownloadItem from './download-item.component';
import { Creators } from 'modules/ducks/downloads/downloads.actions';
import { checkExistingDownloads } from 'services/download.service';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';
import uniq from 'lodash/uniq';

// eslint-disable-next-line no-unused-vars
const ImovieDownloadsScreen = ({
  theme,
  navigation,
  // route,
  downloadsProgress,
  getDownloadsAction,
  downloadsData,

  downloads
}) => {
  const [ids, setIds] = React.useState([]);
  // const [donwloadingItems, setDownloadingItems] = React.useState([]);
  const [activeDownloads, setActiveDownloads] = React.useState([]);
  const activateCheckboxes = false;

  const setDownloadIdsForFething = async () => {
    // console.log('asdas');
    try {
      let data = [];
      // check for active downloads in the background
      const existingDownloads = await checkExistingDownloads();
      setActiveDownloads(existingDownloads);

      // add existing downloads ids to data array
      data = [...existingDownloads.map((d) => d.id)];

      // get downloaded movie ids in the download folder
      let ls = await RNFetchBlob.fs.ls(downloadPath);

      // get the id from filename
      ls = ls.map((filename) => filename.split('_')[0]);

      // add ids to data array
      data = [...data, ...ls];

      // set imovies downloads for listing in the screen
      setIds(uniq(data));
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    setDownloadIdsForFething();
  }, []);

  React.useEffect(() => {
    console.log({ ids });
    if (ids.length) {
      getDownloadsAction({ input: ids });
    }
  }, [ids]);

  // console.log({ zzzzzzz: ids });

  // const getDownloadIdsForFetching = async () => {
  //   const ls = await RNFetchBlob.fs.ls(downloadPath);
  //   setDownloadedItemsIds(ls);
  // };

  // React.useEffect(() => {
  //   if (downloadedItemsIds.length) {
  //     // list the downloaded items complete or not
  //     getDownloadsAction({ input: downloadedItemsIds });
  //   }
  // }, [downloadedItemsIds]);

  const handleSelectItem = (item) => {
    if (activateCheckboxes) {
      // const newItems = selectedItems;
      // const index = selectedItems.findIndex((i) => i === item);
      // if (index >= 0) {
      //   newItems.splice(index, 1);
      //   setSelectedItems([...newItems]);
      // } else {
      //   setSelectedItems([item, ...selectedItems]);
      // }
    } else {
      navigation.navigate('MovieDetailScreen', { videoId: item });
    }
  };

  const renderMain = () => {
    if (downloadsData.length)
      return (
        <ScrollView>
          {downloadsData.map(({ id, thumbnail, ...otherProps }) => {
            let imageUrl = thumbnail ? thumbnail : 'http://via.placeholder.com/65x96.png';

            // let isDownloaded =
            //   typeof downloadsProgress.find(
            //     ({ id: dowloadProgressId }) => id === dowloadProgressId
            //   ) === 'undefined'
            //     ? true
            //     : false;

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
      {renderMain()}
      {/* <ImovieBottomTabs navigation={navigation} route={route} /> */}
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
  getDownloadsAction: Creators.getDownloads
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
