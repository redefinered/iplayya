/* eslint-disable react/prop-types */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SectionList,
  TextInput as FormInput,
  Keyboard
} from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectIsFetching,
  selectRecentSearch,
  selectSimilarMovies
} from 'modules/ducks/movies/movies.selectors';
import { selectMovieCategories, selectCategoriesOf } from 'modules/app';
import uniq from 'lodash/uniq';

const CARD_DIMENSIONS = { WIDTH: 115, HEIGHT: 170 };

const ImovieSearchScreen = ({
  navigation,
  error,
  searchStartAction,
  searchAction,
  results,
  categories,
  isFetching,

  updateRecentSearchAction,
  recentSearch,

  allCategories,
  similarMovies,
  getSimilarMoviesAction,
  getSimilarMoviesStartAction
}) => {
  const theme = useTheme();
  const [term, setTerm] = React.useState('');
  const [showKeyboard, setShowKeyboard] = React.useState(false);

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    getSimilarMoviesStartAction();
  }, []);

  const handleChange = (value) => {
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
    debounce((keyword) => searchAction({ keyword, pageNumber: 1, limit: 10 }), 300),
    []
  );

  const handleItemPress = ({ id: videoId, is_series }) => {
    // console.log({ videoId, is_series });
    // navigate to chanel details screen with `id` parameter
    // navigation.navigate('MovieDetailScreen', { videoId });
    if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
    navigation.navigate('MovieDetailScreen', { videoId });
  };

  React.useEffect(() => {
    if (results.length) {
      let getSimilarMovies = results.map(({ category }) => {
        const c = allCategories.find(({ title }) => title === category);
        if (typeof c === 'undefined') return;
        return parseInt(c.id);
      });
      getSimilarMovies = uniq(getSimilarMovies);
      getSimilarMoviesAction({ limit: 6, categories: getSimilarMovies });
      Keyboard.dismiss();
    } else {
      getSimilarMoviesStartAction();
    }
  }, [results]);

  const DATA = [
    {
      title: 'Search Results',
      data: [results]
    },
    {
      title: 'Similar Movies',
      data: [similarMovies]
    }
  ];

  // const handleMovieSelect = ({ id: videoId, is_series }) => {
  //   console.log({ videoId, is_series });
  //   if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
  //   navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
  // };

  const handleCategoryPress = (categoryId, title) => {
    navigation.navigate('ImovieScreen', {
      categoryId,
      categoryName: title,
      openImoviesGuide: false
    });
  };

  const onSubmitEditing = () => {
    if (term.length) {
      updateRecentSearchAction(term);
      setTerm(term);
    } else {
      return;
    }
  };

  const handleRecentSearch = () => {
    if (term.length) {
      updateRecentSearchAction(term);
    } else {
      return;
    }
  };

  const handleShowKeyboard = () => {
    setShowKeyboard(true);
  };

  // console.log({ results });

  const renderThumbnail = (uri, title) => {
    if (!uri) {
      return (
        <View
          style={{
            width: CARD_DIMENSIONS.WIDTH,
            height: CARD_DIMENSIONS.HEIGHT,
            backgroundColor: theme.iplayya.colors.white10,
            borderRadius: 8,
            padding: theme.spacing(1)
          }}
        >
          <Text style={{ fontSize: 16, color: theme.iplayya.colors.vibrantpussy }}>{title}</Text>
        </View>
      );
    }
    return (
      <Image
        style={{ width: CARD_DIMENSIONS.WIDTH, height: CARD_DIMENSIONS.HEIGHT, borderRadius: 8 }}
        source={{ uri }}
      />
    );
  };

  const renderItem = ({ item: { id, thumbnail: uri, title, is_series } }) => {
    return (
      <TouchableOpacity
        style={{ marginRight: 10, marginBottom: 10 }}
        onPress={() => handleItemPress({ id, is_series })}
      >
        {renderThumbnail(uri, title)}
      </TouchableOpacity>
    );
  };

  const renderResult = () => {
    if (error)
      return (
        <Text
          style={{
            ...createFontFormat(14, 19),
            fontWeight: '700',
            color: theme.iplayya.colors.white50,
            paddingVertical: theme.spacing(2)
          }}
        >
          Zero result
        </Text>
      );
    if (results.length)
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
            renderItem={renderSection}
            renderSectionHeader={({ section }) => (
              <View>
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
              </View>
            )}
          />

          {/* <Text
            style={{
              ...createFontFormat(14, 19),
              fontWeight: '700',
              color: theme.iplayya.colors.white80,
              paddingVertical: 15
            }}
          >
            Search Results
          </Text>
          <FlatList
            getItemLayout={(data, index) => ({
              length: CARD_DIMENSIONS.HEIGHT,
              offset: CARD_DIMENSIONS.HEIGHT * index,
              index
            })}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            // ListFooterComponent={<View>{renderSimilarMovies()}</View>}
          /> */}
          {/* <FlatList
              data={results}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item: { id } }) => (
                <CategoryScrollList key={id} data={results} onSelect={handleItemPress} />
              )}
              // initialScrollIndex={scrollIndex}
              // onEndReached={(info) => handleEndReached(info)}
              onEndReachedThreshold={0.5}
              // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
            /> */}
          {/* {results.map(({ id, title, is_series }) => (
              <TouchableRipple key={id} onPress={() => handleItemPress({ id, is_series })}>
                <Text
                  style={{
                    ...createFontFormat(16, 22),
                    paddingVertical: 15,
                    paddingHorizontal: theme.spacing(2)
                  }}
                >
                  {title}
                </Text>
              </TouchableRipple>
            ))} */}
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
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </React.Fragment>
    );
  };

  const renderRecentSearch = () => {
    if (term.length || !term.length) {
      if (results.length) return;
      return (
        <React.Fragment>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {recentSearch.map((term, index) => (
              <TouchableRipple key={index} onPress={() => setTerm(term)}>
                <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
                  {term}
                </Text>
              </TouchableRipple>
            ))}
          </ScrollView>
        </React.Fragment>
      );
    }
  };
  // console.log({ categories, allCategories });
  const renderSuggestedSearch = () => {
    // > 0 && term.length <= 3
    if (term.length || !term.length) {
      /// return if search results is not empty
      if (results.length) return;

      if (categories.length)
        return (
          <React.Fragment>
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map(({ id, title }) => (
                <TouchableRipple key={id} onPress={() => handleCategoryPress(id, title)}>
                  <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
                    {title}
                  </Text>
                </TouchableRipple>
              ))}
            </ScrollView>
          </React.Fragment>
        );
    }
  };

  return (
    <ContentWrap style={styles.container}>
      <TextInput
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
        name="search"
        returnKeyType="search"
        autoFocus
        showSoftInputOnFocus={showKeyboard}
        focusAction={handleShowKeyboard}
        onSubmitEditing={(term) => onSubmitEditing(term)}
        handleChangeText={(term) => handleChange(term)}
        value={term}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        keyboardType="email-address"
        autoCompleteType="email"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
        placeholder="Search a movie"
        left={
          <RNPTextInput.Icon
            name={() => {
              return isFetching ? (
                <Icon
                  name="search"
                  size={theme.iconSize(4)}
                  style={{ marginRight: theme.spacing(-0.3) }}
                />
              ) : (
                <Icon
                  name="search"
                  size={theme.iconSize(4)}
                  style={{ marginRight: theme.spacing(-0.3) }}
                />
              );
            }}
            onPress={() => handleRecentSearch()}
          />
        }
        // onFocus={() => this.setState({ isolatedInputs: true })}
        // onBlur={() => this.setState({ isolatedInputs: false })}
      />
      {renderResult()}
      {renderRecentSearch()}
      {renderSuggestedSearch()}
    </ContentWrap>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImovieSearchScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  }
});

const actions = {
  searchAction: Creators.search,
  searchStartAction: Creators.searchStart,
  updateRecentSearchAction: Creators.updateRecentSearch,
  getSimilarMoviesAction: Creators.getSimilarMovies,
  getSimilarMoviesStartAction: Creators.getSimilarMoviesStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  categories: selectCategoriesOf('movies'),
  recentSearch: selectRecentSearch,
  similarMovies: selectSimilarMovies,
  allCategories: selectMovieCategories
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
