/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, ScrollView, TextInput as FormInput } from 'react-native';
import { Text, ActivityIndicator, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectIsFetching,
  selectCategoriesOf
} from 'modules/ducks/movies/movies.selectors';

const ImovieSearchScreen = ({
  navigation,
  error,
  searchStartAction,
  searchAction,
  results,
  categories,
  isFetching
}) => {
  const theme = useTheme();
  const [term, setTerm] = React.useState('');

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
  }, []);

  const handleChange = (value) => {
    setTerm(value);
  };

  React.useEffect(() => {
    if (term.length === 0) {
      searchStartAction();
    }
    if (term.length) {
      if (term.length <= 2) return;

      search(term);
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

  // const handleMovieSelect = ({ id: videoId, is_series }) => {
  //   console.log({ videoId, is_series });
  //   if (is_series) return navigation.navigate('SeriesDetailScreen', { videoId });
  //   navigation.navigate('MovieDetailScreen', { videoId }); // set to true temporarily
  // };

  const handleCategoryPress = (categoryId, title) => {
    navigation.navigate('ImovieScreen', { categoryId, categoryName: title });
  };

  // console.log({ results });

  const renderResult = () => {
    if (error)
      return (
        <Text
          style={{
            ...createFontFormat(14, 19),
            fontWeight: '700',
            color: theme.iplayya.colors.white50,
            paddingVertical: 15
          }}
        >
          Zero result
        </Text>
      );
    if (results.length)
      return (
        <React.Fragment>
          <Text
            style={{
              ...createFontFormat(14, 19),
              fontWeight: '700',
              color: theme.iplayya.colors.white50,
              paddingVertical: 15
            }}
          >
            Search Results
          </Text>
          <ScrollView>
            {results.map(({ id, title, is_series }) => (
              // Set is_series to true fron now
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
            ))}
          </ScrollView>
        </React.Fragment>
      );
  };

  const renderSuggestedSearch = () => {
    if (term.length > 0 && term.length <= 3) {
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
                paddingVertical: 15
              }}
            >
              Suggested Search
            </Text>
            <ScrollView>
              {categories.map(({ id, title }) => (
                <TouchableRipple key={id} onPress={() => handleCategoryPress(id, title)}>
                  <Text style={{ ...createFontFormat(16, 22), paddingVertical: 15 }}>{title}</Text>
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
        handleChangeText={handleChange}
        value={term}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        keyboardType="email-address"
        autoCompleteType="email"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        placeholder="Search a movie"
        left={
          <RNPTextInput.Icon
            name={() => {
              return isFetching ? (
                <ActivityIndicator />
              ) : (
                <Icon name="search" size={30} style={{ marginRight: theme.spacing(2) }} />
              );
            }}
          />
        }
        // onFocus={() => this.setState({ isolatedInputs: true })}
        // onBlur={() => this.setState({ isolatedInputs: false })}
      />
      {renderResult()}
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
  searchStartAction: Creators.searchStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  categories: selectCategoriesOf('movies')
});

export default connect(mapStateToProps, actions)(Container);
