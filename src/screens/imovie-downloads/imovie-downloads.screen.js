/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
// import RadioButton from 'components/radio-button/radio-button.component';
import Spacer from 'components/spacer.component';
import NoDownloads from 'assets/downloads-empty.svg';
import { createFontFormat } from 'utils';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from 'screens/imovie/imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectDownloads,
  selectFavorites,
  selectDownloadsProgress,
  selectDownloadsData
} from 'modules/ducks/movies/movies.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import DownloadItem from './download-item.component';
import { Creators } from 'modules/ducks/movies/movies.actions';

const dirs = RNFetchBlob.fs.dirs;

// eslint-disable-next-line no-unused-vars
const ImovieDownloadsScreen = ({
  theme,
  navigation,
  route,
  downloadsProgress,
  getDownloadsAction,
  downloadsData
}) => {
  // const [files, setFiles] = React.
  const activateCheckboxes = false;

  const getSavedVideos = async () => {
    const ls = await RNFetchBlob.fs.ls(dirs.DocumentDir);
    console.log({ ls });
    // const downloadedMovies = downloadsProgress.map(({ id }) => {
    //   return;
    // });
  };

  React.useEffect(() => {
    const input = Object.keys(downloadsProgress).map((key) => parseInt(key));
    // console.log({ input });
    getSavedVideos();

    /// TO FIX: if the downloadsProgress resets the downloads data is not going to be set
    // so the downloads screen is going to be empty even if the downloads are actually still
    // in the phone storage. Refactor so the downloads list is based on the files in storage
    // instead of the downloadsProgress array in state
    getDownloadsAction({ input });
  }, []);

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
            let url = thumbnail ? thumbnail : 'http://via.placeholder.com/65x96.png';
            return (
              <DownloadItem
                key={id}
                id={id}
                url={url}
                {...otherProps}
                handleSelectItem={handleSelectItem}
              />
            );
          })}
          <Spacer size={100} />
        </ScrollView>
      );
    return <EmptyState theme={theme} navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderMain()}
      <ImovieBottomTabs navigation={navigation} route={route} />
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
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(ImovieDownloadsScreen);
