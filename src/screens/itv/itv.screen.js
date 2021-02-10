/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ItemPreview from 'components/item-preview/item-preview.component';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from 'components/button/button.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import SnackBar from 'components/snackbar/snackbar.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo,
  selectGenres,
  selectChannels
} from 'modules/ducks/itv/itv.selectors';

import { urlEncodeTitle } from 'utils';
import Spacer from 'components/spacer.component';

const favorites = [
  {
    id: '2',
    name: 'Football'
  },
  {
    id: '3',
    name: 'Baseball'
  }
];

const ItvScreen = ({
  navigation,
  error,
  genres,
  channels,
  getGenresAction,
  getChannelsAction,
  paginatorInfo,
  setPaginatorInfoAction,
  getChannelsByCategoriesAction
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [favorited, setFavorited] = React.useState('');
  const [genresData, setGenresData] = React.useState([]);
  const [channelsData, setChannelsData] = React.useState([]);

  // get genres on mount
  React.useEffect(() => {
    setPaginatorInfoAction({ limit: 10, pageNumber: 1 }); // for debugging
    getGenresAction();
  }, []);

  // setup genres data
  React.useEffect(() => {
    if (genres.length) {
      let data = genres.map(({ id, title }) => ({ id, title }));
      data.unshift({ id: 'all', title: 'All channels' });
      setGenresData(data);

      // fetch data from all channels initially
      // getChannelsAction({ ...paginatorInfo });
    }
  }, [genres]);

  // setup channels data
  React.useEffect(() => {
    if (channels.length) {
      let data = channels.map(({ id, title }) => ({
        id,
        title,
        thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
      }));
      setChannelsData(data);
    }
  }, [channels]);

  // const handleCategorySelect = (categoryId) => {
  //   getChannelsAction;
  // };

  /**
   * TODO: This is temporary, make it so this function calls to addChannelToFavorites
   * @param {string} title title property of the selected item to add to favorites
   */
  const handleAddToFavorites = (title) => {
    setFavorited(title);
    setShowSnackBar(true);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  if (error) {
    <Text>{error}</Text>;
  }

  const handleItemSelect = (videoId) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('SportChanelDetailScreen', { videoId });
  };

  const onCategorySelect = (id) => {
    // when changing category, reset the pagination info
    setPaginatorInfoAction({ limit: 10, pageNumber: 1 });

    // set the selected category in state
    setSelectedCategory(id);
  };

  React.useEffect(() => {
    if (selectedCategory === 'all') {
      getChannelsAction({ ...paginatorInfo });
    } else {
      getChannelsByCategoriesAction({ ...paginatorInfo, categories: [parseInt(selectedCategory)] });
    }
  }, [selectedCategory]);

  console.log({ channels });

  return (
    <View style={styles.container}>
      {channelsData.length ? (
        <React.Fragment>
          <ScrollView>
            <SelectorPills
              data={genresData}
              labelkey="title"
              onSelect={onCategorySelect}
              selected={selectedCategory}
            />
            <Spacer />
            {/* featured items section */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Featured TV Channels
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {channelsData.map(({ id, ...itemProps }) => (
                  <ItemPreview onSelect={handleItemSelect} key={id} {...itemProps} />
                ))}
              </ScrollView>
            </View>

            <View>
              {channelsData.map(({ id, ...itemProps }) => (
                <ListItemChanel
                  key={id}
                  id={id}
                  onSelect={handleAddToFavorites}
                  onRightActionPress={handleAddToFavorites}
                  isFavorite={
                    typeof favorites.find(({ id: fid }) => parseInt(fid) === id) !== 'undefined'
                      ? true
                      : false
                  }
                  {...itemProps}
                  full
                />
              ))}
            </View>
          </ScrollView>
        </React.Fragment>
      ) : (
        <ContentWrap>
          <Text>No movies found</Text>
          <Button mode="contained" onPress={() => navigation.navigate('MovieDetailScreen')}>
            <Text>test</Text>
          </Button>
        </ContentWrap>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 30,
          paddingTop: 15,
          paddingBottom: 30,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
          <Icon name="heart-solid" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Favorites</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
          <Icon name="download" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Downloaded</Text>
        </TouchableWithoutFeedback>
      </View>

      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  genres: selectGenres,
  paginatorInfo: selectPaginatorInfo,
  channels: selectChannels
});

const actions = {
  getGenresAction: Creators.getGenres,
  getChannelsAction: Creators.getChannels,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  setPaginatorInfoAction: Creators.setPaginatorInfo,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories
};

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader
)(ItvScreen);
