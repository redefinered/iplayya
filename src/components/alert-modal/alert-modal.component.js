import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Text } from 'react-native-paper';
import Button from 'components/button/button.component';
import Icon from 'components/icon/icon.component';

import styles from './alert-modal.styles';

const AlertModal = ({
  theme,
  visible,
  confirmText,
  confirmAction,
  hideAction,
  message,
  variant,
  ...otherProps
}) => {
  let { iconName, iconColor } = otherProps;

  switch (variant) {
    case 'success':
      iconName = 'success';
      iconColor = '#13BD38';
      break;
    case 'danger':
      iconName = 'alert';
      iconColor = '#FF5050';
      break;
    case null:
      iconName = iconName || null;
      iconColor = iconColor || null;
      break;
  }
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <Pressable onPress={() => hideAction()} style={styles.container}>
        <View style={styles.contentWrap}>
          <View style={styles.content}>
            <View style={styles.iconWrap}>
              <Icon name={iconName} size={50} style={{ color: iconColor }} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.text}>{message}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              labelStyle={{ ...styles.button, color: theme.iplayya.colors.black50 }}
              onPress={() => confirmAction()}
            >
              Cancel
            </Button>
            <Button labelStyle={styles.button} onPress={() => confirmAction()}>
              {confirmText}
            </Button>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

AlertModal.propTypes = {
  theme: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  confirmText: PropTypes.string,
  confirmAction: PropTypes.func,
  hideAction: PropTypes.func,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string
};

AlertModal.defaultProps = {
  confirmText: 'Got it'
};

export default withTheme(AlertModal);
