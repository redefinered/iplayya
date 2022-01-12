/* eslint-disable react/prop-types */

import React from 'react';
import { TextInput as FormInput, Pressable, SectionList, KeyboardAvoidingView } from 'react-native';
import { Text, withTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectSearchResultsPaginator,
  selectRecentSearch,
  selectIsFetching,
  selectSearchNorResult
} from 'modules/ducks/itv/itv.selectors';
import { selectItvGenres } from 'modules/app';
import withNotifRedirect from 'components/with-notif-redirect.component';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvSearchScreen = ({
  theme,
  genres,
  results,
  noResult,
  navigation,
  isFetching,
  searchAction,
  recentSearch,
  searchStartAction,
  searchResultsPaginator,
  clearRecentSearchAction,
  updateRecentSearchAction,
  setBottomTabsVisibleAction,
  resetSearchResultsPaginatorAction
}) => {
  const [term, setTerm] = React.useState('');
  const [recents, setRecents] = React.useState(recentSearch.slice(0, 5));
  const [resultPadding, setResultPadding] = React.useState(0);
  const [showEmptyResult, setShowEmptyMessage] = React.useState(false);
  const [data, setData] = React.useState([]);

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    resetSearchResultsPaginatorAction();
  }, []);

  React.useEffect(() => {
    const list = [];

    /// setup data
    if (recents.length) {
      if (!term) {
        list.push({ title: 'Recent Search', data: recents, layout: 2, clearButton: true });
      }
    }

    if (results.length)
      list.push({ title: 'Search Results', data: results, layout: 1, clearButton: false });

    if (genres.length) {
      if (!results.length) {
        list.push({
          title: 'Suggested Search',
          data: genres.map(({ id, title }) => ({ id, title, layout: 2 })),
          clearButton: false
        });
      }
    }

    /// set list data
    setData(list);
  }, [results, recents, genres, term]);

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
    searchStartAction();
    resetSearchResultsPaginatorAction();

    if (term.length) {
      if (term.length >= 2) {
        // execute the search
        search(term, false);
      }
    }
  }, [term]);

  const search = React.useCallback(
    debounce((keyword, shouldIncrement) => {
      // execute search
      searchAction({ keyword, ...searchResultsPaginator }, shouldIncrement);
    }, 1500),
    [searchResultsPaginator]
  );

  const handleItemPress = ({ id, title }, layout = 1) => {
    if (layout === 2)
      return navigation.navigate('ItvScreen', {
        genreId: genres.find(({ title: genreTitle }) => genreTitle === title).id
      });
    /// the recent searched item is the one selected by user
    updateRecentSearchAction({ id, title });

    navigation.navigate('ItvChannelDetailScreen', { channelId: id });
  };

  const renderItem = ({ item }) => {
    if (item.layout === 2) {
      const { id, title } = item;
      return (
        <TouchableRipple onPress={() => handleItemPress({ id, title }, item.layout)}>
          <ContentWrap>
            <Text style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}>
              {title}
            </Text>
          </ContentWrap>
        </TouchableRipple>
      );
    }

    return (
      <ListItemChanel
        item={item}
        full
        showFavoriteButton={false}
        isCatchUpAvailable={false}
        thumbnail={channelplaceholder}
        handleItemPress={handleItemPress}
      />
    );
  };

  const handleSeachFocus = () => {
    /// resets search result paginator so the result is page 1
    resetSearchResultsPaginatorAction();

    // reset search state
    searchStartAction();

    setBottomTabsVisibleAction({ hideTabs: true });
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
          autoFocus
          onFocus={handleSeachFocus}
          multiline={false}
          name="search"
          returnKeyType="search"
          handleChangeText={(term) => handleChange(term)}
          value={term}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          autoCompleteType="email"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
          placeholder="Search a channel"
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

      <SectionList
        contentContainerStyle={{ paddingBottom: resultPadding }}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title, clearButton } }) => (
          <ContentWrap
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
              {title}
            </Text>
            {clearButton && (
              <Pressable onPress={clearRecentSearchAction}>
                <Text style={{ color: theme.iplayya.colors.vibrantpussy }}>Clear</Text>
              </Pressable>
            )}
          </ContentWrap>
        )}
      />
    </KeyboardAvoidingView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ItvSearchScreen {...props} />
  </ScreenContainer>
);

const actions = {
  searchAction: Creators.search,
  searchStartAction: Creators.searchStart,
  clearRecentSearchAction: Creators.clearRecentSearch,
  updateRecentSearchAction: Creators.updateRecentSearch,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible,
  resetSearchResultsPaginatorAction: Creators.resetSearchResultsPaginator
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  noResult: selectSearchNorResult,
  searchResultsPaginator: selectSearchResultsPaginator,
  recentSearch: selectRecentSearch,
  genres: selectItvGenres
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
