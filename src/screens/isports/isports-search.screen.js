/* eslint-disable react/prop-types */

import React from 'react';
import {
  TextInput as FormInput,
  FlatList,
  View,
  Keyboard,
  Pressable,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
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
import { Creators } from 'modules/ducks/isports/isports.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import debounce from 'lodash/debounce';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectSearchResults,
  selectSearchResultsPaginator,
  selectRecentSearch,
  selectIsFetching
} from 'modules/ducks/isports/isports.selectors';
import { selectIsportsGenres } from 'modules/app';
import withNotifRedirect from 'components/with-notif-redirect.component';

const ITEM_HEIGHT = 96;
const channelplaceholder = require('assets/channel-placeholder.png');

const ItvSearchScreen = ({
  theme,
  genres,
  results,
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

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    resetSearchResultsPaginatorAction();
  }, []);

  React.useEffect(() => {
    // do not update the list while searching
    if (isFetching) return;

    /// only display 5 most recent search terms
    setRecents(recentSearch.slice(0, 5));
  }, [recentSearch]);

  const handleChange = (value) => {
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

  const handleItemPress = ({ id, title }) => {
    /// the recent searched item is the one selected by user
    updateRecentSearchAction({ id, title });

    // navigate to chanel details screen with `id` parameter
    navigation.navigate('IsportsChannelDetailScreen', { channelId: id });
  };

  const handleGenrePress = (genreId) => {
    navigation.navigate('IsportsScreen', { genreId, openItvGuide: false });
  };

  const handleScrollAction = () => {
    Keyboard.dismiss();
    // setOnEndReachedCalledDuringMomentum(false);
    setBottomTabsVisibleAction({ hideTabs: true });
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
    if (results.length)
      return (
        <React.Fragment>
          <FlatList
            showsVerticalScrollIndicator={false}
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
            onScroll={handleScrollAction}
            data={results}
            keyExtractor={(item) => item.id}
            getItemLayout={(data, index) => {
              return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
            }}
            renderItem={({ item }) => (
              <ListItemChanel
                item={item}
                full
                // showepg={false}
                showFavoriteButton={false}
                isCatchUpAvailable={false}
                thumbnail={channelplaceholder}
                handleItemPress={handleItemPress}
              />
            )}
            // onEndReached={() => handleEndReached()}
          />
          <View style={{ height: resultPadding + theme.spacing(5) }} />
        </React.Fragment>
      );
  };

  const renderRecentSearch = () => {
    /// do not show if searchbar is not in use
    // if (!isSearching) return;

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

  const renderSuggestedSearch = () => {
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
            </ContentWrap>
            <View>
              {genres.map(({ id, title }) => (
                <ContentWrap key={id}>
                  <TouchableRipple onPress={() => handleGenrePress(id)}>
                    <Text
                      style={{ ...createFontFormat(16, 22), paddingVertical: theme.spacing(2) }}
                    >
                      {title}
                    </Text>
                  </TouchableRipple>
                </ContentWrap>
              ))}
            </View>
            <View style={{ height: resultPadding + theme.spacing(5) }} />
          </React.Fragment>
        );
    }
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
      {/* <View style={{ flex: 1, height: Dimensions.get('window').height }}></View> */}
      <ScrollView>
        {renderResult()}
        {renderRecentSearch()}
        {renderSuggestedSearch()}
      </ScrollView>

      {/* <SectionList
        IF NEEDS OPTIMIZATION CONVERT SCREEN TO SECTION LIST INSTEAD OF DISPLAYING SEPARATE LISTS PER DATA
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
      /> */}
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
  searchResultsPaginator: selectSearchResultsPaginator,
  recentSearch: selectRecentSearch,
  genres: selectIsportsGenres
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
