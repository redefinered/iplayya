import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

import styles from './action-sheet.styles';

const ActionSheet = ({ visible, showAction }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <Pressable style={styles.container} onPress={() => showAction(false)}>
        <View style={styles.contentWrap}>
          <Pressable style={styles.itemContainer}>
            <View style={styles.iconContainer}>
              <Icon name="edit" style={styles.text} size={17} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Edit</Text>
            </View>
          </Pressable>
          <Pressable style={styles.itemContainer}>
            <View style={styles.iconContainer}>
              <Icon name="delete" style={styles.text} size={17} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Delete</Text>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

ActionSheet.propTypes = {
  visible: PropTypes.bool.isRequired,
  showAction: PropTypes.func.isRequired
};

export default ActionSheet;
