/* eslint-disable react/prop-types */
import React from 'react';
import { View } from 'react-native';
import Icon from 'components/icon/icon.component';

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const TabBarIcon = ({ name }) => {
  // console.log({ navigation });
  return (
    <View style={styles.container}>
      <Icon name={name} size={26} />
    </View>
  );
};

export default TabBarIcon;
