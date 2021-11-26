import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectIsSearching } from 'modules/ducks/itv/itv.selectors';
import { Creators } from 'modules/ducks/itv/itv.actions';
import Icon from 'components/icon/icon.component.js';

const ItvSearchButton = ({ theme, isSearching, setIsSearchingAction }) => {
  const renderIcon = () => {
    if (isSearching) return <Icon name="close" size={theme.iconSize(3)} />;

    return <Icon name="search" size={theme.iconSize(3)} />;
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableRipple
        borderless={true}
        style={{ borderRadius: 44, padding: 8 }}
        rippleColor="rgba(0,0,0,0.28)"
        onPress={() => setIsSearchingAction(!isSearching)}
      >
        <View style={{ ...styles.button }}>{renderIcon()}</View>
      </TouchableRipple>
    </View>
  );
};

ItvSearchButton.propTypes = {
  theme: PropTypes.object,
  isSearching: PropTypes.bool,
  setIsSearchingAction: PropTypes.func
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = createStructuredSelector({ isSearching: selectIsSearching });

const actions = {
  setIsSearchingAction: Creators.setIsSearching
};

const enhance = compose(connect(mapStateToProps, actions), withTheme);
export default enhance(ItvSearchButton);
