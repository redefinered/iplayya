/* eslint-disable react/prop-types */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  SectionList,
  TextInput as FormInput,
  Keyboard
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
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath } from 'utils';
import uniq from 'lodash/uniq';
import theme from 'common/theme';

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
  similarMovies,
  getSimilarMoviesAction,
  getSimilarMoviesStartAction
}) => {
  const [term, setTerm] = React.useState('');
  const [downloads, setDownloads] = React.useState(null);

  console.log({ results });
  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    getSimilarMoviesStartAction();

    getDownloadsList();
  }, []);

  const getDownloadsList = async () => {
    const downloadsList = await RNFetchBlob.fs.ls(downloadPath);
    setDownloads(downloadsList);
  };

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
    debounce((keyword) => {
      /// execute search
      searchAction({ keyword, pageNumber: 1, limit: 10 });

      /// update recent search terms
      updateRecentSearchAction(term);
    }, 300),
    []
  );

  const handleItemPress = ({ id: videoId, is_series }) => {
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

  const renderItem = ({ item }) => {
    const downloadedThumbnail = downloads.find((file) => {
      /// split item filename
      // filename format: mt_id.jpg. e.g. mt_12390_.jpg
      const splitFilename = file.split('_');
      const id = splitFilename[1];
      // eslint-disable-next-line react/prop-types
      return id === item.id;
    });
    return (
      <MovieItem item={item} onSelect={handleItemPress} downloadedThumbnail={downloadedThumbnail} />
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

    if (!downloads) return;

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
          // contentInset={{ top: theme.spacing(2), left: 0, right: 0, bottom: theme.spacing(2) }}
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
  // console.log({ categories, categories });
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
        onSubmitEditing={(term) => onSubmitEditing(term)}
        handleChangeText={(term) => handleChange(term)}
        value={term}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
        placeholder="Search a movie"
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
  // categories: selectCategoriesOf('movies'),
  recentSearch: selectRecentSearch,
  similarMovies: selectSimilarMovies,
  categories: selectMovieCategories
});

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
