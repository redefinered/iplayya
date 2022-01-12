/* eslint-disable react/prop-types */

import React from 'react';
import {
  StyleSheet,
  TextInput as FormInput,
  FlatList,
  View,
  Keyboard,
  Image,
  TouchableOpacity,
  SectionList,
  Pressable
} from 'react-native';
import { Text, withTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/imusic-search/imusic-search.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectIsFetching,
  selectSimilarGenre,
  selectSearchNorResult
} from 'modules/ducks/imusic-search/imusic-search.selectors';
import {
  selectAlbums,
  selectGenres,
  selectRecentSearch
} from 'modules/ducks/music/music.selectors';
import { ScrollView } from 'react-native-gesture-handler';
import uniq from 'lodash/uniq';
import withNotifRedirect from 'components/with-notif-redirect.component';

const coverplaceholder = require('assets/imusic-placeholder.png');

const ImusicSearchScreen = ({
  navigation,
  theme,
  // eslint-disable-next-line no-unused-vars
  error,
  searchStartAction,
  searchAction,
  results,
  noResult,
  albums,
  similarGenre,
  // allGenres,

  isFetching,

  updateRecentSearchAction,
  recentSearch,
  clearRecentSearchAction,

  getSimilarGenreStartAction,
  getSimilarGenreAction,

  setBottomTabsVisibleAction
}) => {
  const [term, setTerm] = React.useState('');
  const [recents, setRecents] = React.useState(recentSearch.slice(0, 5));
  const [showEmptyResult, setShowEmptyMessage] = React.useState(false);

  const CARD_DIMENSIONS = { WIDTH: 148, HEIGHT: 148 };

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
  }, []);

  const handleChange = (value) => {
    setShowEmptyMessage(false);

    setTerm(value);
  };

  React.useEffect(() => {
    if (term.length === 0) {
      searchStartAction();
    }
    if (term.length) {
      if (term.length >= 2) {
        search(term);
      }
    }
  }, [term]);

  React.useEffect(() => {
    // do not update the list while searching
    if (isFetching) return;

    /// only display 5 most recent search terms
    setRecents(recentSearch.slice(0, 5));
  }, [recentSearch]);

  React.useEffect(() => {
    const allGenresD = results.map(({ genre }) => {
      return genre;
    });
    const newGenre = allGenresD.join(',');
    const ex = newGenre.split(',');
    const exGenre = uniq(ex);
    const filteredGenre = exGenre.map(() => albums.find(({ genre }) => genre === genre));
    if (results.length) {
      const ids = filteredGenre.map(({ id }) => {
        return parseInt(id);
      });
      getSimilarGenreAction({ limit: 6, genres: ids });
      Keyboard.dismiss();
    } else {
      getSimilarGenreStartAction();
    }
  }, [results]);

  const DATA = [
    {
      title: 'Search Results',
      data: [results]
    },
    {
      title: 'Similar Genre',
      data: [similarGenre]
    }
  ];

  const handleItemPress = ({ id, name }) => {
    updateRecentSearchAction({ id, name });

    navigation.replace('AlbumDetailScreen', { albumId: id });
  };

  const handleGenrePress = (genreId) => {
    navigation.navigate('ImusicScreen', { genreId, openItvGuide: false });
  };

  const search = React.useCallback(
    debounce((keyword) => searchAction({ keyword, pageNumber: 1, limit: 10 }), 300),
    []
  );

  const handleEndReached = () => {
    console.log('end reached!');
    if (term.length) {
      if (term.length <= 20) return;
      search(term, true);
    }
  };

  const handleScrollAction = () => {
    Keyboard.dismiss();
    // setOnEndReachedCalledDuringMomentum(false);
    setBottomTabsVisibleAction({ hideTabs: true });
  };

  const handleSeachFocus = () => {
    // reset search state
    searchStartAction();

    setBottomTabsVisibleAction({ hideTabs: true });
  };

  React.useEffect(() => {
    if (noResult) return setShowEmptyMessage(true);

    /// hide empty message if input is empty
    if (!term) return setShowEmptyMessage(false);

    setShowEmptyMessage(false);
  }, [noResult]);

  const renderThumbnail = ({ cover, name, performer }) => {
    if (!cover) {
      return (
        <React.Fragment>
          <View
            style={{
              width: CARD_DIMENSIONS.WIDTH,
              height: CARD_DIMENSIONS.HEIGHT,
              backgroundColor: theme.iplayya.colors.white10,
              borderRadius: 8,
              padding: 10,
              marginBottom: theme.spacing(1)
            }}
          >
            <Text style={{ fontSize: 16, color: theme.iplayya.colors.vibrantpussy }}>{name}</Text>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              marginBottom: theme.spacing(1),
              maxWidth: 148
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 12, maxWidth: 148, color: theme.iplayya.colors.white50 }}
          >
            {performer}
          </Text>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Image
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            borderRadius: 8,
            marginBottom: theme.spacing(1)
          }}
          source={coverplaceholder}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            marginBottom: theme.spacing(1),
            maxWidth: 148
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ fontSize: 12, maxWidth: 148, color: theme.iplayya.colors.white50 }}
        >
          {performer}
        </Text>
      </React.Fragment>
    );
  };

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, name, performer, cover } }) => {
    return (
      <View
        style={{
          flex: 1,
          marginLeft: theme.spacing(2),
          marginBottom: theme.spacing(2),
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          style={{ marginRight: theme.spacing(2) }}
          onPress={() => handleItemPress({ id, name })}
        >
          {renderThumbnail({ name, performer, cover })}
        </TouchableOpacity>
      </View>
    );
  };

  const renderListLoader = () => {
    if (isFetching)
      return (
        <View style={{ paddingTop: 0, paddingBottom: theme.spacing(5) }}>
          <ActivityIndicator size="small" />
        </View>
      );
  };

  const renderResult = () => {
    if (!results.length) return;
    return (
      <React.Fragment>
        <SectionList
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: CARD_DIMENSIONS.HEIGHT,
            offset: CARD_DIMENSIONS.HEIGHT * index,
            index
          })}
          keyExtractor={(item) => item.id}
          sections={DATA}
          onScroll={handleScrollAction}
          renderItem={renderSection}
          ListFooterComponent={renderListLoader()}
          onEndReached={() => handleEndReached()}
          renderSectionHeader={({ section }) => (
            <ContentWrap>
              <Text
                style={{
                  ...createFontFormat(14, 19),
                  fontWeight: '700',
                  color: theme.iplayya.colors.white80,
                  paddingVertical: theme.spacing(2)
                }}
              >
                {section.title}
              </Text>
            </ContentWrap>
          )}
        />
      </React.Fragment>
    );
  };

  const renderSection = ({ item }) => {
    return (
      <React.Fragment>
        <FlatList
          getItemLayout={(data, index) => ({
            length: CARD_DIMENSIONS.HEIGHT,
            offset: CARD_DIMENSIONS.HEIGHT * index,
            index
          })}
          data={item}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </React.Fragment>
    );
  };

  const renderRecentSearch = () => {
    // do not show if there is results
    if (results.length) return;

    // do not show if there is no recent search items
    if (!recents.length) return;

    return (
      <ContentWrap>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              ...createFontFormat(14, 19),
              fontWeight: '700',
              color: theme.iplayya.colors.white50,
              paddingVertical: theme.spacing(2)
            }}
          >
            Recent Search
          </Text>
          <Pressable onPress={clearRecentSearchAction}>
            <Text style={{ color: theme.iplayya.colors.vibrantpussy }}>Clear</Text>
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {recents.map(({ id, name }, index) => (
            <TouchableRipple key={index} onPress={() => handleItemPress({ id, name })}>
              <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
                {name}
              </Text>
            </TouchableRipple>
          ))}
        </ScrollView>
      </ContentWrap>
    );
  };

  const renderSuggestedSearch = () => {
    if (term.length || !term.length) {
      /// return if search results is not empty
      if (results.length) return;

      if (albums.length)
        return (
          <React.Fragment>
            <ContentWrap>
              <Text
                style={{
                  ...createFontFormat(14, 19),
                  fontWeight: '700',
                  color: theme.iplayya.colors.white50,
                  paddingVertical: theme.spacing(2)
                }}
              >
                Suggested Search
              </Text>
            </ContentWrap>
            <ScrollView>
              {albums.map(({ id, genre }) => (
                <ContentWrap key={id}>
                  <TouchableRipple onPress={() => handleGenrePress(id)}>
                    <Text
                      style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}
                    >
                      {genre}
                    </Text>
                  </TouchableRipple>
                </ContentWrap>
              ))}
            </ScrollView>
          </React.Fragment>
        );
    }
  };

  const renderNoResultText = () => {
    if (!showEmptyResult) return;

    if (!term) return;

    return (
      <ContentWrap>
        <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
          {`There is nothing found for "${term}"`}
        </Text>
      </ContentWrap>
    );
  };

  return (
    <View style={styles.container}>
      <ContentWrap>
        <TextInput
          onFocus={handleSeachFocus}
          multiline={false}
          render={(props) => (
            <FormInput
              {...props}
              style={{
                flex: 1,
                marginLeft: 40,
                fontSize: 16,
                justifyContent: 'center',
                color: '#ffffff'
              }}
            />
          )}
          name="search"
          returnKeyType="search"
          autoFocus
          handleChangeText={(term) => handleChange(term)}
          value={term}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          autoCompleteType="email"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
          placeholder="Search a music"
          left={
            <RNPTextInput.Icon
              name={() => {
                return isFetching ? (
                  <ActivityIndicator size="small" style={{ marginRight: 5 }} />
                ) : (
                  <Icon name="search" size={theme.iconSize(4)} style={{ marginRight: 5 }} />
                );
              }}
            />
          }
        />
      </ContentWrap>
      {renderNoResultText()}

      {renderResult()}
      {renderRecentSearch()}
      {renderSuggestedSearch()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImusicSearchScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const actions = {
  searchAction: Creators.search,
  searchStartAction: Creators.searchStart,
  updateRecentSearchAction: MusicCreators.updateRecentSearch,
  clearRecentSearchAction: MusicCreators.clearRecentSearch,
  getSimilarGenreAction: Creators.getSimilarGenre,
  getSimilarGenreStartAction: Creators.getSimilarGenreStart,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  noResult: selectSearchNorResult,
  recentSearch: selectRecentSearch,
  similarGenre: selectSimilarGenre,
  albums: selectAlbums,
  allGenres: selectGenres
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
