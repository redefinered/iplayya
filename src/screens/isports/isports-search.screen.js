/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, TextInput as FormInput, Keyboard, View, SectionList } from 'react-native';
import { Text, useTheme, TouchableRipple, ActivityIndicator } from 'react-native-paper';
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
  selectIsFetching,
  selectRecentSearch,
  selectSimilarChannel
} from 'modules/ducks/isports/isports.selectors';
import { ScrollView } from 'react-native-gesture-handler';
import { selectGenres } from 'modules/ducks/isports/isports.selectors';
import uniq from 'lodash/uniq';

import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';

const channelplaceholder = require('assets/channel-placeholder.png');

const ISportsSearchScreen = ({
  navigation,
  error,
  searchStartAction,
  searchAction,
  results,
  genres,
  isFetching,
  recentSearch,
  updateRecentSearchAction,
  getSimilarChannelAction,
  getSimilarChannelStartAction,
  similarChannel
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
    navigation.navigate('IsportsChannelDetailScreen', { channelId });
  };

  React.useEffect(() => {
    if (results.length) {
      let mapChannel = results.map(({ genre }) => {
        const { id } = genres.find(({ title }) => title === genre);
        return parseInt(id);
      });
      mapChannel = uniq(mapChannel);
      getSimilarChannelAction({ limit: 6, categories: mapChannel });
      Keyboard.dismiss();
    } else {
      getSimilarChannelStartAction();
    }
  }, [results]);

  const DATA = [
    {
      title: 'Search Results',
      data: results
    },
    {
      title: 'Similar Channel',
      data: similarChannel
    }
  ];

  const handleGenrePress = (genreId) => {
    navigation.navigate('IsportsScreen', { genreId });
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

  const handleEndReached = () => {
    console.log('end reached!');
    if (term.length) {
      if (term.length <= 20) return;
      search(term, true);
    }
  };

  const handleScrollAction = () => {
    Keyboard.dismiss();
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
    if (error)
      return (
        <ContentWrap>
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
        </ContentWrap>
      );

    if (results.length)
      return (
        <React.Fragment>
          <SectionList
            showsVerticalScrollIndicator={false}
            sections={DATA}
            keyExtractor={(item) => item.id}
            onScroll={handleScrollAction}
            renderSectionFooter={renderListLoader}
            renderItem={renderSection}
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
          {/* <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <ContentWrap>
                <Text
                  style={{
                    ...createFontFormat(14, 19),
                    fontWeight: '700',
                    color: theme.iplayya.colors.white80,
                    paddingVertical: 15
                  }}
                >
                  Search Results
                </Text>
              </ContentWrap>
            }
            ListFooterComponent={renderListLoader()}
            onScroll={handleScrollAction}
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item: { id, epgtitle, ...itemProps } }) => (
              <ListItemChanel
                onSelect={() => handleItemPress(id)}
                full
                thumbnail={channelplaceholder}
                epgtitle={epgtitle}
                {...itemProps}
              />
            )}
            onEndReached={() => handleEndReached()}
          /> */}
        </React.Fragment>
        // {/* <React.Fragment>
        //   <Text
        //     style={{
        //       ...createFontFormat(14, 19),
        //       fontWeight: '700',
        //       color: theme.iplayya.colors.white50,
        //       paddingVertical: 15
        //     }}
        //   >
        //     Search Results
        //   </Text>
        //   <ScrollView>
        //     {results.map(({ id, title }) => (
        //       <TouchableRipple key={id} onPress={() => handleItemPress(id)}>
        //         <Text
        //           style={{
        //             ...createFontFormat(16, 22),
        //             paddingVertical: 15,
        //             paddingHorizontal: theme.spacing(2)
        //           }}
        //         >
        //           {title}
        //         </Text>
        //       </TouchableRipple>
        //     ))}
        //   </ScrollView>
        // </React.Fragment> */}
      );
  };

  const renderSection = ({ item: { id, epgtitle, ...itemProps } }) => {
    return (
      <ListItemChanel
        onSelect={() => handleItemPress(id)}
        full
        thumbnail={channelplaceholder}
        epgtitle={epgtitle}
        {...itemProps}
      />
    );
  };

  const renderRecentSearch = () => {
    if (term.length || !term.length) {
      if (results.length) return;
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
          </ContentWrap>
        </React.Fragment>
      );
    }
  };

  const renderSuggestedSearch = () => {
    // if (term.length > 0 && term.length <= 3)
    if (term.length || !term.length) {
      /// return if search results is not empty
      if (results.length) return;

      if (genres.length)
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
              <ScrollView showsVerticalScrollIndicator={false}>
                {genres.map(({ id, title }) => (
                  <TouchableRipple key={id} onPress={() => handleGenrePress(id)}>
                    <Text
                      style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}
                    >
                      {title}
                    </Text>
                  </TouchableRipple>
                ))}
              </ScrollView>
            </ContentWrap>
          </React.Fragment>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ContentWrap>
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
          onSubmitEditing={(term) => onSubmitEditing(term)}
          handleChangeText={(term) => handleChange(term)}
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
              onPress={() => handleRecentSearch()}
            />
          }
          // onFocus={() => this.setState({ isolatedInputs: true })}
          // onBlur={() => this.setState({ isolatedInputs: false })}
        />
      </ContentWrap>
      {renderResult()}
      {renderRecentSearch()}
      {renderSuggestedSearch()}
    </View>
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
  searchStartAction: Creators.searchStart,
  updateRecentSearchAction: Creators.updateRecentSearch,
  getSimilarChannelAction: Creators.getSimilarChannel,
  getSimilarChannelStartAction: Creators.getSimilarChannelStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  genres: selectGenres,
  recentSearch: selectRecentSearch,
  similarChannel: selectSimilarChannel
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
