/* eslint-disable react/prop-types */
import React from 'react';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { Title, TextInput } from 'react-native-paper';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';

class OnBoarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      portalAddress: '',
      username: '',
      password: ''
    };
  }

  render() {
    const { setPortalAddressAction } = this.props;
    const { portalAddress } = this.state;

    return (
      <KeyboardAvoidingView>
        <SafeAreaView>
          <ContentWrap>
            <Title>Portal Address</Title>
            <Spacer />
            <TextInput
              label="Portal Address"
              placeholder="Enter portal address"
              value={portalAddress}
              onChangeText={(portalAddress) => this.setState({ portalAddress })}
            />
            <Button
              disabled={!portalAddress.length || portalAddress.length < 12}
              onPress={() => setPortalAddressAction({ portalAddress })}
            >
              Submit
            </Button>
          </ContentWrap>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const actions = {
  setPortalAddressAction: Creators.setPortalAddress
};

export default connect(null, actions)(OnBoarding);
