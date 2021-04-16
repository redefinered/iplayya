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
  const [downloadedItemsIds, setDownloadedItemsIds] = React.useState([]);
  const activateCheckboxes = false;

  const setDownloadIdsForFething = async () => {
    try {
      /// return if downloads state is empty
      if (!downloads.length) return;

      let ids = downloads.map(({ id }) => id);
      setDownloadedItemsIds(ids);
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    setDownloadIdsForFething();
  }, []);

  React.useEffect(() => {
    if (downloadedItemsIds.length) {
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

            return (
              <DownloadItem
                key={id}
                id={id}
                progress={progress}
                imageUrl={imageUrl}
                handleSelectItem={handleSelectItem}
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

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(ImovieDownloadsScreen);
