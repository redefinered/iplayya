/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import ScreenContainer from 'components/screen-container.component';
import { View, Text, Pressable } from 'react-native';
import Logo from 'images/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';

import Spacer from 'components/spacer.component';

const SignInScreen = () => (
  <ScreenContainer>
    <View style={{ paddingTop: 100, paddingBottom: 64 }}>
      <ContentWrap>
        <Logo style={{ alignSelf: 'center' }} />
        <Spacer size={60} />
        <TextInput placeholder="email" />
        <TextInput placeholder="password" secureTextEntry />
        <Spacer size={6} />
        <Button mode="contained">Login</Button>
        <Spacer size={50} />
        <Pressable>
          <Text style={{ color: 'white', alignSelf: 'center' }}>Forgot passsword?</Text>
        </Pressable>
        <Spacer size={50} />
        <Text style={{ color: 'white', alignSelf: 'center' }}>
          Don't you have an account yet?{' '}
          <Text onPress={() => console.log('test')} style={{ color: '#E34398' }}>
            Sign-up
          </Text>
        </Text>
        <Spacer size={121} />
        <Pressable>
          <Text style={{ color: 'white', alignSelf: 'center' }}>Need help?</Text>
        </Pressable>
      </ContentWrap>
    </View>
  </ScreenContainer>
);

export default SignInScreen;
