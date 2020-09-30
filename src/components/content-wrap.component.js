import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const ContentWrap = ({ children, style }) => (
  <View style={{ paddingHorizontal: 15, ...style }}>{children}</View>
);

ContentWrap.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any.isRequired
};

export default ContentWrap;
