import React from 'react';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import { Text } from 'react-native-paper';

const AccountScreen = () => (
  <ContentWrap>
    <Text>Account Screen</Text>
  </ContentWrap>
);

export default withHeaderPush(AccountScreen);
