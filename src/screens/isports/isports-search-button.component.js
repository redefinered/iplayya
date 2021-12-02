import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectFavorites, selectIsSearching } from 'modules/ducks/isports/isports.selectors';
import { Creators } from 'modules/ducks/isports/isports.actions';
import Icon from 'components/icon/icon.component.js';

const IsportsSearchButton = ({ theme, isSearching, setIsSearchingAction, favorites }) => {
  const handlePress = () => {
    if (!favorites.length) return;

    if (isSearching) return setIsSearchingAction(false);

    setIsSearchingAction(!isSearching);
  };
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
        onPress={handlePress}
      >
        <View style={{ ...styles.button }}>{renderIcon()}</View>
      </TouchableRipple>
    </View>
  );
};

IsportsSearchButton.propTypes = {
  theme: PropTypes.object,
  isSearching: PropTypes.bool,
  favorites: PropTypes.array,
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

const mapStateToProps = createStructuredSelector({
  favorites: selectFavorites,
  isSearching: selectIsSearching
});

const actions = {
  setIsSearchingAction: Creators.setIsSearching
};

const enhance = compose(connect(mapStateToProps, actions), withTheme);
export default enhance(IsportsSearchButton);
