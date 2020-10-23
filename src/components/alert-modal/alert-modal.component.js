import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/button/button.component';
import Icon from 'components/icon/icon.component';

import styles from './alert-modal.styles';

const AlertModal = ({ visible, showAction, message, confirmText, variant }) => {
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
      <Pressable onPress={() => showAction(false)} style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name={iconName} size={50} style={{ color }} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{message}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button labelStyle={styles.button} onPress={() => showAction(false)}>
              {confirmText}
            </Button>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

AlertModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  showAction: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string
};

AlertModal.defaultProps = {
  variant: 'success',
  confirmText: 'Got it'
};

export default AlertModal;
