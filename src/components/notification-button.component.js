import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';
import { createStructuredSelector } from 'reselect';
import { selectNotifications } from 'modules/ducks/itv/itv.selectors';
import { connect } from 'react-redux';

const NotificationButton = ({ notifications }) => {
  const navigation = useNavigation();

  const renderIndicator = () => {
    const someUnreadItem = notifications.find(({ read }) => read === false);

    /// if no unread items found, do nothing
    if (typeof someUnreadItem === 'undefined') return;

    return <View style={styles.indicator} />;
  };
  return (
    <TouchableRipple
      borderless={true}
      onPress={() => navigation.navigate('NotificationsScreen')}
      style={{ borderRadius: 44, padding: 5 }}
      rippleColor="rgba(0,0,0,0.28)"
    >
      <View style={{ ...styles.button }}>
        <Icon name="notifications" size={24} />
        {renderIndicator()}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: theme.iplayya.colors.strongpussy,
    position: 'absolute',
    top: 10,
    right: 10
  }
});

NotificationButton.propTypes = {
  notifications: PropTypes.array
};

const mapStateToProps = createStructuredSelector({ notifications: selectNotifications });

export default connect(mapStateToProps)(NotificationButton);
