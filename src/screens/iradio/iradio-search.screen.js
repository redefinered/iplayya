/* eslint-disable react/prop-types */

import React from 'react';
import {
  StyleSheet,
  TextInput as FormInput,
  View,
  FlatList,
  Pressable,
  ScrollView,
  Keyboard
} from 'react-native';
import { withTheme, Text, TouchableRipple, ActivityIndicator } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import withLoader from 'components/with-loader.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createStructuredSelector } from 'reselect';
import debounce from 'lodash/debounce';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  selectRadioStations,
  selectError,
  selectSearchResults,
  selectSearchResultsPaginator,
  selectRecentSearch,
  selectIsFetching
} from 'modules/ducks/iradio/iradio.selectors';
import withNotifRedirect from 'components/with-notif-redirect.component';

const IradioSearchScreen = ({
  navigation,
  theme,
  // radioStations,
  error,
  searchStartAction,
  searchAction,
  results,
  searchResultsPaginator,
  isFetching,

  updateRecentSearchAction,
  recentSearch,

  resetSearchResultsPaginatorAction,
  setBottomTabsVisibleAction
}) => {
  const [term, setTerm] = React.useState('');

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

  const handleItemPress = ({ cmd, number, name }) => {
    navigation.navigate('IradioScreen', { cmd, name, number });
    console.log(cmd, number, name);
  };

  const onSubmitEditing = () => {
    if (term.length) {
      updateRecentSearchAction(term);
      setTerm(term);
    } else {
      return;
    }
  };

  // const handleRecentSearch = () => {
  //   if (term.length) {
  //     updateRecentSearchAction(term);
  //   } else {
  //     return;
  //   }
  // };

  const handleScrollAction = () => {
    Keyboard.dismiss();
    // setOnEndReachedCalledDuringMomentum(false);
    setBottomTabsVisibleAction({ hideTabs: true });
  };

  const handleEndReached = () => {
    console.log('end reached!');
    if (term.length) {
      if (term.length <= 20) return;
      search(term, true);
    }
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
          data={results}
          onScroll={handleScrollAction}
          onEndReached={() => handleEndReached()}
          ListFooterComponent={renderListLoader()}
          keyExtractor={(item) => item.id}
          renderItem={({ item: { name, cmd, id, number } }) => {
            return (
              <React.Fragment>
                <Pressable
                  onPress={() => handleItemPress({ cmd, id, number, name })}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
                      paddingHorizontal: theme.spacing(2),
                      paddingVertical: theme.spacing(2)
                    }
                  ]}
                >
                  <ContentWrap
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
                        {name}
                      </Text>
                    </View>
                  </ContentWrap>
                </Pressable>
              </React.Fragment>
            );
          }}
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
                <TouchableRipple
                  rippleColor="rgba(0,0,0,0.28)"
                  key={index}
                  onPress={() => setTerm(term)}
                >
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
          placeholder="Search a radio station"
          left={
            <RNPTextInput.Icon
              name={() => {
                return (
                  <Icon
                    name="search"
                    size={theme.iconSize(4)}
                    style={{ marginRight: theme.spacing(-0.3) }}
                  />
                );
              }}
            />
          }
        />
      </ContentWrap>
      {renderResult()}
      {renderRecentSearch()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IradioSearchScreen {...props} />
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
  radioStations: selectRadioStations,
  error: selectError,
  isFetching: selectIsFetching,
  results: selectSearchResults,
  searchResultsPaginator: selectSearchResultsPaginator,
  recentSearch: selectRecentSearch
});

const enhance = compose(
  connect(mapStateToProps, actions),
  withTheme,
  withLoader,
  withNotifRedirect
);

export default enhance(Container);
