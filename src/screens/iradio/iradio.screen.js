/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import SnackBar from 'components/snackbar/snackbar.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
// import ItemPreviewListItem from 'components/item-preview-list-item/item-preview-list-item.component';
import theme from 'common/theme';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as RadioActionCreators } from 'modules/ducks/radio/radio.actions';
import { selectRadioStations } from 'modules/ducks/radio/radio.selectors';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo
} from 'modules/ducks/radio/radio.selectors';

import { createFontFormat, urlEncodeTitle } from 'utils';

const dummydata = [
  {
    id: 1,
    title: 'Station Number One',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('Station Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Station',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Another Sample Station'
    )}`
  },
  {
    id: 3,
    title: 'Lorem Ipsum Podcast',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Lorem Ipsum Podcast'
    )}`
  },
  {
    id: 4,
    title: 'The Dark Radio',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('The Dark Radio')}`
  },
  {
    id: 5,
    title: 'John Weak Radio',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('John Weak Radio')}`
  },
  {
    id: 6,
    title: 'The Past and The Furriest 8',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  }
];

const dummyfavs = [
  {
    id: 1,
    title: 'Station Number One',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('Station Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Station',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Another Sample Station'
    )}`
  }
];

const RadioStationsTab = () => {
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [favorited, setFavorited] = React.useState('');

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

  return dummydata.map(({ id, title, favorite, thumbnail: url }) => (
    <React.Fragment key={id}>
      <ContentWrap
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            source={{ url }}
          />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{title}</Text>
        </View>
        <View>
          <Pressable onPress={() => handleAddToFavorites(title)}>
            <Icon
              name="heart-solid"
              size={24}
              style={{ color: favorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
            />
          </Pressable>
        </View>
      </ContentWrap>
      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
    </React.Fragment>
  ));
};

const FavoritesTab = (props) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  return dummyfavs.map(({ id, title }) => (
    <React.Fragment key={id}>
      <ContentWrap
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            source={{
              url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(title)}`
            }}
          />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{title}</Text>
        </View>
        <View>
          <Pressable onPress={() => setShowConfirm(true)}>
            <Icon
              name="heart-solid"
              size={24}
              style={{ color: theme.iplayya.colors.vibrantpussy }}
            />
          </Pressable>
        </View>
      </ContentWrap>
      <AlertModal
        iconName="unfavorite"
        iconColor="#FF5050"
        confirmText="Remove"
        message="Do you want to remove this station to your Favorite list?"
        hideAction={() => setShowConfirm(false)}
        confirmAction={() => setShowConfirm(false)}
        visible={showConfirm}
      />
    </React.Fragment>
  ));
};

const initialLayout = { width: Dimensions.get('window').width };

const IradioScreen = ({
  navigation,
  error,
  getRadioStationsAction,
  paginatorInfo: { limit, pageNumber },
  theme,
  ...otherprops
}) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'radio', title: 'Radio Stations' },
    { key: 'second', title: 'Favorites' }
  ]);

  const renderScene = SceneMap({
    radio: RadioStationsTab,
    second: FavoritesTab
  });

  // React.useEffect(() => {
  //   getRadioStationsAction({ limit, pageNumber });
  // }, []);

  let { radioStations } = otherprops;

  radioStations = radioStations.length ? radioStations : dummydata;

  if (error) {
    <Text>{error}</Text>;
  }

  /**
   * TEMPORARY FEATURED ITEMS
   * change to featured category when API is ready
   */
  const featuredItems = radioStations.slice(0, 5);

  const handleRadioSelect = (videoId) => {
    navigation.navigate('RadioDetailScreen', { videoId });
  };

  return (
    <View style={styles.container}>
      {radioStations.length ? (
        <React.Fragment>
          <ScrollView>
            {/* featured items section */}
            <View style={{ marginBottom: 30 }}>
              <ContentWrap>
                <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>
                  Popular Radio Stations
                </Text>
              </ContentWrap>
              <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
                {featuredItems.map(({ id, title }) => (
                  <Pressable
                    onPress={() => handleRadioSelect(id)}
                    key={id}
                    style={{ marginRight: 10 }}
                  >
                    <Image
                      style={{ width: 240, height: 133, borderRadius: 8 }}
                      source={{
                        url: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(title)}`
                      }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 10
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', ...createFontFormat(16, 19) }}>
                        {title}
                      </Text>
                      <Pressable
                        onPress={() => console.log('heart pressed!')}
                        style={{ marginRight: 15 }}
                      >
                        <Icon name="heart-solid" size={24} />
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <TabView
              theme={theme}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={(props) => {
                return <TabBars {...props} />;
              }}
            />

            {/* pushes up the content to make room for the bottom tab */}
            <View style={{ paddingBottom: 100 }} />
          </ScrollView>
        </React.Fragment>
      ) : (
        <ContentWrap>
          <Text>No stations found</Text>
        </ContentWrap>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
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
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const TabBars = ({ navigationState: { index, routes }, jumpTo }) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
      {routes.map(({ key, title }) => (
        <View key={key} style={{ flex: 4 }}>
          <Pressable onPress={() => jumpTo(key)} style={{ alignItems: 'center' }}>
            <Text
              style={{
                color:
                  routes[index].key === key
                    ? theme.iplayya.colors.vibrantpussy
                    : theme.iplayya.colors.white50,
                fontWeight: 'bold',
                marginBottom: 10,
                ...createFontFormat(14, 19)
              }}
            >
              {title}
            </Text>
            <View
              style={{
                width: 60,
                height: 2,
                backgroundColor:
                  routes[index].key === key
                    ? theme.iplayya.colors.vibrantpussy
                    : theme.iplayya.colors.white50
              }}
            />
          </Pressable>
        </View>
      ))}
      <View style={{ flex: 4 }} />
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
  radioStations: selectRadioStations,
  paginatorInfo: selectPaginatorInfo
});

const actions = {
  getRadioStationsAction: RadioActionCreators.get,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(IradioScreen);
