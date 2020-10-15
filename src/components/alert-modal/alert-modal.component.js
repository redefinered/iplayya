import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/button/button.component';
import Icon from 'components/icon/icon.component';

import styles from './alert-modal.styles';

const AlertModal = ({ visible, showAction, message }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent style={{ backgroundColor: 'red' }}>
      <Pressable onPress={() => showAction(false)} style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name="alert" size={60} style={styles.icon} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{message}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button labelStyle={styles.button} onPress={() => showAction(false)}>
              Got it
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
  message: PropTypes.string.isRequired
};

export default AlertModal;
