import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Button from 'components/button/button.component';
import Icon from 'components/icon/icon.component';

import styles from './alert-modal.styles';

const AlertModal = ({ visible, showAction }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent style={{ backgroundColor: 'red' }}>
      <Pressable onPress={() => showAction(false)} style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name="alert" size={60} style={styles.icon} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>
                Oops! Your credentials is not valid. Call your IPTV provider for assistance.
              </Text>
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
  visible: PropTypes.bool,
  showAction: PropTypes.func
};

export default AlertModal;
