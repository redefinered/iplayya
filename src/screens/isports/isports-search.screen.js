/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, TextInput as FormInput } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/isports/isports.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectIsFetching
} from 'modules/ducks/isports/isports.selectors';
import { ScrollView } from 'react-native-gesture-handler';
import { selectGenres } from 'modules/ducks/isports/isports.selectors';
import Spacer from '../../components/spacer.component';

const ISportsSearchScreen = ({
  navigation,
  error,
  searchStartAction,
  searchAction,
  results,
  genres,
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

  const handleItemPress = (channelId) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('ChannelDetailScreen', { channelId });
  };

  const handleGenrePress = (genreId) => {
    navigation.navigate('ItvScreen', { genreId });
  };

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
            {results.map(({ id, title }) => (
              <TouchableRipple key={id} onPress={() => handleItemPress(id)}>
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

      if (genres.length)
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
              {genres.map(({ id, title }) => (
                <TouchableRipple key={id} onPress={() => handleGenrePress(id)}>
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
      <Spacer />
      <TextInput
        render={(props) => (
          <FormInput
            {...props}
            style={{
              flex: 1,
              justifyContent: 'center',
              marginLeft: 40,
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
        autoCompleteType="email"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
        placeholder="Search a sports channel"
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
    <ISportsSearchScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  genres: selectGenres
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
