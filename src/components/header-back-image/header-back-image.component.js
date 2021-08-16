import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const HeaderBackImage = ({ vertical }) => (
  <View style={styles.backButtonContainer}>
    <Icon
      name={vertical ? 'caret-down' : 'arrow-left'}
      style={{ color: 'white' }}
      size={theme.iconSize(3)}
    />
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

HeaderBackImage.defaultProps = {
  vertical: false
};

HeaderBackImage.propTypes = {
  vertical: PropTypes.bool
};

export default HeaderBackImage;
