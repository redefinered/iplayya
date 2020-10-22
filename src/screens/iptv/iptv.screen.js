import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectProviders } from 'modules/ducks/iptv/iptv.selectors';

import NoProvider from 'images/no_provider.svg';

const IptvScreen = ({ providers }) => {
  if (providers.length)
    return (
      <ContentWrap>
        <Text>ITPV Screen</Text>
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

export default withHeaderPush(connect(mapStateToProps)(IptvScreen));
