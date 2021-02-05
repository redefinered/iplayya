import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';

import CheckShape from 'assets/check-shape.svg';

const RadioButton = ({ theme, selected }) => (
  <View style={styles(theme).container}>{selected && <CheckShape width={24} height={24} />}</View>
);

RadioButton.propTypes = {
  theme: PropTypes.object,
  selected: PropTypes.bool.isRequired
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.iplayya.colors.vibrantpussy,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default withTheme(RadioButton);
