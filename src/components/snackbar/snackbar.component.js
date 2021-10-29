import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

import styles from './snackbar.styles';
import theme from 'common/theme';

const SnackBar = ({ visible, message, iconName, iconColor }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name={iconName} size={theme.iconSize(6)} style={{ color: iconColor }} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{message}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

SnackBar.propTypes = {
  visible: PropTypes.bool.isRequired,
  hideAction: PropTypes.func,
  message: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  iconColor: PropTypes.string
};

SnackBar.defaultProps = {
  iconName: 'success',
  iconColor: '#13BD38'
};

export default SnackBar;
