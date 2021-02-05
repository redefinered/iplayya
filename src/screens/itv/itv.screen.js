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
// import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPaginatorInfo
} from 'modules/ducks/itv/itv.selectors';

import { urlEncodeTitle } from 'utils';
import Spacer from 'components/spacer.component';

const dummydata = [
  {
    id: 1,
    title: 'Movie Number One',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Movie Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Movie',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'Another Sample Movie'
    )}`
  },
  {
    id: 3,
    title: 'Lorem Ipsum Reloaded',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'Lorem Ipsum Reloaded'
    )}`
  },
  {
    id: 4,
    title: 'The Dark Example',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('The Dark Example')}`
  },
  {
    id: 5,
    title: 'John Weak 5',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('John Weak 5')}`
  },
  {
    id: 6,
    title: 'The Past and The Furriest 8',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  }
];

const categories = [
  {
    id: '1',
    label: 'All Channels',
    name: 'all'
  },
  {
    id: '2',
    label: 'UK Sports Box Office',
    name: 'uk-sports'
  },
  {
    id: '3',
    label: 'UK HD',
    name: 'uk-hd'
  },
  {
    id: '4',
    label: 'NBA TV',
    name: 'nba-tv'
  }
];

// const dates = [
//   {
//     id: '1',
//     label: 'All Sports',
//     name: 'all'
//   },
//   {
//     id: '2',
//     label: 'Football',
//     name: 'football'
//   },
//   {
//     id: '3',
//     label: 'Baseball',
//     name: 'baseball'
//   },
//   {
//     id: '4',
//     label: 'Basketball',
//     name: 'basketball'
//   }
// ];

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

const ItvScreen = ({ navigation, error, ...otherprops }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('1');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [favorited, setFavorited] = React.useState('');
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = React.useState([]);
  let { movies } = otherprops;

  movies = data.length ? data : dummydata;

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

  /**
   * TEMPORARY FEATURED ITEMS
   * change to featured category when API is ready
   */
  const featuredItems = movies.slice(0, 5);

  const handleItemSelect = (videoId) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('SportChanelDetailScreen', { videoId });
  };

  const onCategorySelect = (id) => {
    setSelectedCategory(id);
  };

  return (
    <View style={styles.container}>
      {movies.length ? (
        <React.Fragment>
          <ScrollView>
            <SelectorPills
              data={categories}
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
                {featuredItems.map(({ id, ...itemProps }) => (
                  <ItemPreview onSelect={handleItemSelect} key={id} {...itemProps} />
                ))}
              </ScrollView>
            </View>

            <View>
              {featuredItems.map(({ id, ...itemProps }) => (
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
  // movies: selectMovies,
  paginatorInfo: selectPaginatorInfo
});

const actions = {
  // getMoviesAction: MoviesActionCreators.getMovies,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader
)(ItvScreen);
