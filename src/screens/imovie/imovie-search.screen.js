/* eslint-disable react/prop-types */

import React from 'react';
import {
  TextInput as FormInput,
  Pressable,
  ScrollView,
  View,
  FlatList,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import MovieItem from 'components/movie-item/movie-item.component';
import { ActivityIndicator, Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectIsFetching,
  selectRecentSearch,
  selectSimilarMovies
} from 'modules/ducks/movies/movies.selectors';
import { selectMovieCategories } from 'modules/app';
import uniq from 'lodash/uniq';
import theme from 'common/theme';
import { selectSearchNorResult } from 'modules/ducks/movies/movies.selectors';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const ImovieSearchScreen = ({
  navigation,
  noResult,
  searchStartAction,
  searchAction,
  results,
  categories,
  isFetching,
  recentSearch,
  getSimilarMoviesAction,
  getSimilarMoviesStartAction,
  clearRecentSearchAction,
  setBottomTabsVisibleAction,
  resetSearchResultsPaginatorAction,
  getMovieStartAction
}) => {
  const [term, setTerm] = React.useState('');
  const [recents, setRecents] = React.useState(recentSearch.slice(0, 5));
  // const [downloads, setDownloads] = React.useState(null);
  const [showEmptyResult, setShowEmptyMessage] = React.useState(false);
  const [resultPadding, setResultPadding] = React.useState(0);

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    getSimilarMoviesStartAction();

    // getDownloadsList();
  }, []);

  React.useEffect(() => {
    // do not update the list while searching
    if (isFetching) return;

    /// only display 5 most recent search terms
    setRecents(recentSearch.slice(0, 5));
  }, [recentSearch]);

  const handleChange = (value) => {
    /// hide empty message when typing
    setShowEmptyMessage(false);

    setTerm(value);
  };

  React.useEffect(() => {
    if (term.length === 0) {
      searchStartAction();
    }
    if (term.length) {
      if (term.length >= 2) {
        search(term, false);
      }
    }
  }, [term]);

  const search = React.useCallback(
    debounce((keyword) => {
      /// execute search
      searchAction({ keyword, pageNumber: 1, limit: 10 });
    }, 300),
    []
  );

  const handleItemPress = ({ id: videoId, is_series }) => {
    /// clear movie to prevent flicker
    getMovieStartAction();

    if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });

    navigation.navigate('MovieDetailScreen', { videoId });
  };

  React.useEffect(() => {
    if (results.length) {
      let getSimilarMovies = results.map(({ category }) => {
        const c = categories.find(({ title }) => title === category);
        if (typeof c === 'undefined') return;
        return parseInt(c.id);
      });
      getSimilarMovies = uniq(getSimilarMovies);
      getSimilarMoviesAction({
        limit: 6,
        categories: getSimilarMovies.filter((i) => {
          if (i) return i;
        })
      });
      Keyboard.dismiss();
    } else {
      getSimilarMoviesStartAction();
    }
  }, [results]);

  const handleCategoryPress = (categoryId, title) => {
    navigation.navigate('ImovieScreen', {
      categoryId,
      categoryName: title,
      openImoviesGuide: false
    });
  };

  const renderListLoader = () => {
    if (isFetching)
      return (
        <View style={{ paddingTop: 0, paddingBottom: 30 }}>
          <ActivityIndicator size="small" />
        </View>
      );
  };

  const renderResult = () => {
    if (!results.length) return;

    return (
      <ContentWrap>
        <FlatList
          ListHeaderComponent={
            <ContentWrap>
              <Text
                style={{
                  ...createFontFormat(14, 19),
                  fontWeight: '700',
                  color: theme.iplayya.colors.white50,
                  paddingVertical: theme.spacing(2)
                }}
              >
                Search Results
              </Text>
            </ContentWrap>
          }
          ListFooterComponent={renderListLoader()}
          getItemLayout={(data, index) => ({
            length: CARD_DIMENSIONS.HEIGHT,
            offset: CARD_DIMENSIONS.HEIGHT * index,
            index
          })}
          data={results}
          numColumns={3}
          renderItem={({ item }) => <MovieItem {...item} handleItemPress={handleItemPress} />}
          keyExtractor={(item) => item.id}
        />
        <View style={{ height: resultPadding + theme.spacing(5) }} />
      </ContentWrap>
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

        {recents.map(({ id, title }, index) => (
          <TouchableRipple key={index} onPress={() => handleItemPress({ id, title })}>
            <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
              {title}
            </Text>
          </TouchableRipple>
        ))}
      </ContentWrap>
    );
  };
  // console.log({ categories, categories });
  const renderSuggestedSearch = () => {
    // > 0 && term.length <= 3
    if (term.length || !term.length) {
      /// return if search results is not empty
      if (results.length) return;

      if (categories.length)
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
            <ContentWrap>
              {categories.map(({ id, title }) => (
                <TouchableRipple key={id} onPress={() => handleCategoryPress(id, title)}>
                  <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
                    {title}
                  </Text>
                </TouchableRipple>
              ))}
            </ContentWrap>
          </React.Fragment>
        );
    }
  };

  const handleSearchbarLayout = ({ nativeEvent: { layout } }) => {
    setResultPadding(layout.height);
  };

  React.useEffect(() => {
    if (noResult) return setShowEmptyMessage(true);

    /// hide empty message if input is empty
    if (!term) return setShowEmptyMessage(false);

    setShowEmptyMessage(false);
  }, [noResult]);

  const handleSeachFocus = () => {
    /// resets search result paginator so the result is page 1
    resetSearchResultsPaginatorAction();

    // reset search state
    searchStartAction();

    setBottomTabsVisibleAction({ hideTabs: true });
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
    <KeyboardAvoidingView behavior="padding">
      <ContentWrap onLayout={handleSearchbarLayout}>
        <TextInput
          onFocus={handleSeachFocus}
          multiline={false}
          name="search"
          returnKeyType="search"
          autoFocus
          handleChangeText={(term) => handleChange(term)}
          value={term}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
          placeholder="Search a movie"
          render={(props) => (
            <FormInput
              {...props}
              style={{
                flex: 1,
                marginLeft: 40,
                justifyContent: 'center',
                fontSize: 16,
                color: '#ffffff'
              }}
            />
          )}
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

      <ScrollView>
        {renderResult()}
        {renderRecentSearch()}
        {renderSuggestedSearch()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImovieSearchScreen {...props} />
  </ScreenContainer>
);

const actions = {
  searchAction: Creators.search,
  searchStartAction: Creators.searchStart,
  clearRecentSearchAction: Creators.clearRecentSearch,
  getSimilarMoviesAction: Creators.getSimilarMovies,
  getSimilarMoviesStartAction: Creators.getSimilarMoviesStart,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible,
  getMovieStartAction: Creators.getMovieStart,
  resetSearchResultsPaginatorAction: Creators.resetSearchResultsPaginator
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  noResult: selectSearchNorResult,
  recentSearch: selectRecentSearch,
  similarMovies: selectSimilarMovies,
  categories: selectMovieCategories
});

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
