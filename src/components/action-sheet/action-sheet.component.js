/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Pressable, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import styles from './action-sheet.styles';
import theme from 'common/theme';
import uuid from 'react-uuid';

const ActionSheet = ({ visible, actions, hideAction }) => {
  // console.log({actions})
  return (
    <Modal animationType="slide" visible={visible} transparent>
      <Pressable style={styles.container} onPress={() => hideAction()}>
        <View style={styles.contentWrap}>
          {actions.map(({ icon, title, onPress, data }) => {
            return (
              <TouchableRipple
                key={uuid()}
                style={styles.itemContainer}
                rippleColor={theme.iplayya.colors.vibrantpussy}
                borderless
                onPress={() => onPress(data)}
              >
                <React.Fragment>
                  <View style={styles.iconContainer}>
                    <Icon name={icon} style={styles.iconColor} size={theme.iconSize(3)} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{title}</Text>
                  </View>
                </React.Fragment>
              </TouchableRipple>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
};

ActionSheet.propTypes = {
  visible: PropTypes.bool.isRequired,
  actions: PropTypes.array,
  data: PropTypes.object
};

export default ActionSheet;
