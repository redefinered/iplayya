/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from 'components/screen-container.component';

const styles = StyleSheet.create({
  walkthroughText: {
    fontSize: 16,
    fontFamily: 'NotoSans',
    fontWeight: '400',
    lineHeight: 21
  }
});

const WalkthroughScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const GoItv = () => {
    navigation.popToTop();
    navigation.navigate('Home');
    navigation.navigate('ItvScreen', { openItvGuide: true });
  };

  const GoMovies = () => {
    navigation.popToTop();
    navigation.navigate('Home');
    navigation.replace('ImovieScreen', { openImoviesGuide: true });
  };

  const GoAccount = () => {
    navigation.navigate('AccountScreen', { openAccountGuide: true });
  };

  const GoIptv = () => {
    navigation.popToTop();
    navigation.navigate('IPTV', { screen: 'IPTV', params: { openIptvGuide: true } });
  };

  const GoIplay = () => {
    navigation.popToTop();
    navigation.navigate('Home');
    navigation.replace('IplayScreen', { openIplayGuide: true });
  };

  return (
    <SafeAreaView>
      <View style={{ paddingTop: 30 }}>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => GoItv()}>
          <View style={{ padding: theme.spacing(2) }}>
            <Text style={styles.walkthroughText}>Watch a channel show on iTV</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => GoMovies()}>
          <View style={{ padding: theme.spacing(2) }}>
            <Text style={styles.walkthroughText}>Watch a movie on iMovie</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => GoIplay()}>
          <View style={{ padding: theme.spacing(2) }}>
            <Text style={styles.walkthroughText}>Play my video on iPlay</Text>
          </View>
        </TouchableRipple>
        <View style={{ padding: theme.spacing(2) }}>
          <Text style={styles.walkthroughText}>Listen to online radios on iRadio</Text>
        </View>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => GoIptv()}>
          <View style={{ padding: theme.spacing(2) }}>
            <Text style={styles.walkthroughText}>Add my IPTV provider</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => GoAccount()}>
          <View style={{ padding: theme.spacing(2) }}>
            <Text style={styles.walkthroughText}>Manage my account settings</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <WalkthroughScreen {...props} />
  </ScreenContainer>
);

export default Container;
