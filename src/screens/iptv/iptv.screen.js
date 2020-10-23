/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import IptvItem from 'components/iptv-item/iptv-item.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import { View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectProviders } from 'modules/ducks/iptv/iptv.selectors';

import NoProvider from 'images/no_provider.svg';
import providersMock from './providers.mock';

const IptvScreen = ({ providers }) => {
  console.log({ providers });
  const [actionSheetVisible, setActionSheetVisible] = React.useState(true);

  if (providersMock.length)
    return (
      <ContentWrap>
        {providersMock.map(({ id, name, username }) => (
          <IptvItem key={id} name={name} username={username} showActions={setActionSheetVisible} />
        ))}
        <ActionSheet visible={actionSheetVisible} showAction={setActionSheetVisible} />
      </ContentWrap>
    );

  return <NoProviders />;
};

const NoProviders = () => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 130
    }}
  >
    <NoProvider />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No providers yet</Text>
    <Spacer />
    <Button>Tap to add you IPTV Provider</Button>
  </View>
);

IptvScreen.propTypes = {
  providers: PropTypes.array
};

const mapStateToProps = createStructuredSelector({ providers: selectProviders });

// export default withHeaderPush(withTheme(connect(mapStateToProps)(IptvScreen)));

export default compose(withHeaderPush, withTheme, connect(mapStateToProps))(IptvScreen);
