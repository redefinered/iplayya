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
import {
  selectError,
  selectIsFetching,
  selectDownloads,
  selectFavorites,
  selectDownloadsProgress,
  selectDownloadsData,
  selectDownloadIds
} from 'modules/ducks/movies/movies.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import DownloadItem from './download-item.component';
import { Creators } from 'modules/ducks/movies/movies.actions';

const dirs = RNFetchBlob.fs.dirs;

// eslint-disable-next-line no-unused-vars
const ImovieDownloadsScreen = ({
  theme,
  navigation,
  // route,
  downloadsProgress,
  getDownloadsAction,
  downloadsData,

  // eslint-disable-next-line no-unused-vars
  resetDownloadsProgressAction
}) => {
  const [downloadedItemsIds, setDownloadedItemsIds] = React.useState([]);
  // const [downloadCompleteItems, setDownloadCompleteItems] = React.useState([]);
  const activateCheckboxes = false;

  const setDownloadIdsForFething = async () => {
    const ls = await RNFetchBlob.fs.ls(dirs.DocumentDir);
    console.log({ ls });
    let downloadsIdsFromFileSystem = ls.map((i) => {
      let splitTitle = i.split('_');
      return splitTitle[0]; /// IDs of donwloaded items
    });

    downloadsIdsFromFileSystem = downloadsIdsFromFileSystem.map((d) => parseInt(d));

    setDownloadedItemsIds(downloadsIdsFromFileSystem);
  };

  React.useEffect(() => {
    // resetDownloadsProgressAction(); /// reset downloads progress for development
    setDownloadIdsForFething();
  }, []);

  React.useEffect(() => {
    if (downloadedItemsIds) {
      // list the downloaded items complete or not
      getDownloadsAction({ input: downloadedItemsIds });
    }
  }, [downloadedItemsIds]);

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

            let isDownloaded =
              typeof downloadsProgress.find(
                ({ id: dowloadProgressId }) => id === dowloadProgressId
              ) === 'undefined'
                ? true
                : false;

            let progress = null;

            if (downloadsProgress.length) {
              let progressData = downloadsProgress.filter(
                ({ id: progressId }) => id === progressId
              );

              let currentProgress = progressData[progressData.length - 1];

              if (typeof currentProgress !== 'undefined') {
                progress = currentProgress.received / currentProgress.total;
              }
            }

            return (
              <DownloadItem
                key={id}
                id={id}
                isDownloaded={isDownloaded}
                progress={progress}
                imageUrl={imageUrl}
                {...otherProps}
                handleSelectItem={handleSelectItem}
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
  getDownloadsAction: Creators.getDownloads,
  resetDownloadsProgressAction: Creators.resetDownloadsProgress
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  downloads: selectDownloads,
  favorites: selectFavorites,
  downloadsProgress: selectDownloadsProgress,
  downloadsData: selectDownloadsData,
  downloadIds: selectDownloadIds
});

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(ImovieDownloadsScreen);
