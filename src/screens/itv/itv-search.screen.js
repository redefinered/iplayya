/* eslint-disable react/prop-types */

import React from 'react';
import {
  StyleSheet,
  TextInput as FormInput,
  FlatList,
  View,
  Keyboard,
  Dimensions
} from 'react-native';
import { Text, withTheme, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
// import withHeaderPush from 'components/with-header-push/with-header-push.component';
// import withScreenContainer from 'components/with-screen-container/with-screen-container.component';
import TextInput from 'components/text-input/text-input.component';
// import suggestions from './suggestions.json';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
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
  selectGenres
} from 'modules/ducks/itv/itv.selectors';
import { ScrollView } from 'react-native-gesture-handler';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';

const channelplaceholder = require('assets/channel-placeholder.png');

const ItvSearchScreen = ({
  navigation,
  theme,
  // eslint-disable-next-line no-unused-vars
  error,
  searchStartAction,
  searchAction,
  results,
  searchResultsPaginator,
  genres,
  isFetching,

  updateRecentSearchAction,
  recentSearch,

  resetSearchResultsPaginatorAction,

  setBottomTabsVisibleAction
}) => {
  // console.log({ loc: 'screen', ...searchResultsPaginator });
  const [term, setTerm] = React.useState('');

  // const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
  //   true
  // );

  // React.useEffect(() => {
  //   setBottomTabsVisibleAction({ hideTabs: true }); // does not work here!!!
  // });

  /// clear previous search result
  React.useEffect(() => {
    searchStartAction();
    resetSearchResultsPaginatorAction();
  }, []);

  const handleChange = (value) => {
    setTerm(value);
  };

  React.useEffect(() => {
    searchStartAction();
    resetSearchResultsPaginatorAction();

    if (term.length) {
      if (term.length >= 2) {
        search(term, false);
      }
    }
  }, [term]);

  const search = React.useCallback(
    debounce((keyword, shouldIncrement) => {
      // console.log({ loc: 'screen before search action call', ...searchResultsPaginator });
      searchAction({ keyword, ...searchResultsPaginator }, shouldIncrement);
      return;
    }, 1500),
    [searchResultsPaginator]
  );

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

  const handleItemPress = (channelId) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('ChannelDetailScreen', { channelId });
  };

  const handleGenrePress = (genreId) => {
    navigation.navigate('ItvScreen', { genreId, openItvGuide: false });
  };

  const handleEndReached = () => {
    console.log('end reached!');
    // if (!onEndReachedCalledDuringMomentum) {
    //   if (term.length) {
    //     if (term.length <= 1) return;
    //     search(term, true);
    //   }

    //   setOnEndReachedCalledDuringMomentum(true);
    // }

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

  const renderListLoader = () => {
    if (isFetching)
      return (
        <View style={{ paddingTop: 0, paddingBottom: 30 }}>
          <ActivityIndicator size="small" />
        </View>
      );
  };

  const renderResult = () => {
    // if (error)
    //   return (
    //     <Text
    //       style={{
    //         ...createFontFormat(14, 19),
    //         fontWeight: '700',
    //         color: theme.iplayya.colors.white50,
    //         paddingVertical: 15
    //       }}
    //     >
    //       Zero result
    //     </Text>
    //   );
    if (results.length)
      return (
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
          renderItem={({ item: { id, epgtitle, ...itemProps } }) => (
            // <TouchableRipple
            //   style={{ paddingHorizontal: theme.spacing(2), height: 52 }}
            //   key={id}
            //   onPress={() => handleItemPress(id)}
            // >
            //   <Text
            //     style={{
            //       ...createFontFormat(16, 22),
            //       paddingVertical: 15,
            //       paddingHorizontal: theme.spacing(2)
            //     }}
            //   >
            //     {title}
            //   </Text>
            // </TouchableRipple>
            <ListItemChanel
              onSelect={() => handleItemPress(id)}
              // onRightActionPress={handleAddToFavorites}
              full
              thumbnail={channelplaceholder}
              epgtitle={epgtitle}
              {...itemProps}
            />
          )}
          onEndReached={() => handleEndReached()}
          // onEndReachedThreshold={0.9}
          // onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
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
            <ScrollView>
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
            </ScrollView>
          </React.Fragment>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ContentWrap>
        <TextInput
          onFocus={() => setBottomTabsVisibleAction({ hideTabs: true })}
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
          onSubmitEditing={(term) => onSubmitEditing(term)}
          handleChangeText={(term) => handleChange(term)}
          value={term}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          autoCompleteType="email"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
          placeholder="Search a channel"
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
        />
      </ContentWrap>
      <View style={{ flex: 1, height: Dimensions.get('window').height }}>{renderResult()}</View>
      {renderRecentSearch()}
      {renderSuggestedSearch()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ItvSearchScreen {...props} />
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
  resetSearchResultsPaginatorAction: Creators.resetSearchResultsPaginator,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  searchResultsPaginator: selectSearchResultsPaginator,
  recentSearch: selectRecentSearch,
  genres: selectGenres
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
