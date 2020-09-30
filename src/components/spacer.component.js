import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const Spacer = ({ size }) => <View style={{ height: size }} />;

Spacer.propTypes = {
  size: PropTypes.number
};

Spacer.defaultProps = {
  size: 15
};

export default Spacer;
