/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import NoDownloads from 'assets/downloads-empty.svg';
import { createFontFormat } from 'utils';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ImovieBottomTabs from 'screens/imovie/imovie-bottom-tabs.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectDownloads
} from 'modules/ducks/movies/movies.selectors';

const ImovieDownloadsScreen = ({ theme, navigation, route }) => {
  const renderMain = () => {
    return <EmptyState theme={theme} navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderMain()}
      <ImovieBottomTabs navigation={navigation} route={route} />
    </View>
  );
};

const EmptyState = ({ theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    <NoDownloads />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No downloads yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Your downloaded movies will appear here.
      </Text>
    </Pressable>
  </View>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  downloads: selectDownloads
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps),
  withLoader,
  withTheme
)(ImovieDownloadsScreen);
