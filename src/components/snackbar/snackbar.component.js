import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

import styles from './snackbar.styles';

const AlertModal = ({ visible, message, variant }) => {
  let iconName = '';
  let color = '';
  switch (variant) {
    case 'success':
      iconName = 'success';
      color = '#13BD38';
      break;
    case 'danger':
      iconName = 'alert';
      color = '#FF5050';
      break;
  }
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name={iconName} size={50} style={{ color }} />
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

AlertModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  hideAction: PropTypes.func,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string
};

AlertModal.defaultProps = {
  variant: 'success'
};

export default AlertModal;
