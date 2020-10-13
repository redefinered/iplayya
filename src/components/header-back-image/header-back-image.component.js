import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'components/icon/icon.component';

const HeaderBackImage = () => (
  <View style={styles.backButtonContainer}>
    <Icon name="chevron-left" style={{ color: 'white' }} size={16} />
  </View>
);

const styles = StyleSheet.create({
  backButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HeaderBackImage;
