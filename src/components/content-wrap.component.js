import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';

const ContentWrap = ({ children, style, scrollable }) => {
  if (scrollable) {
    return <ScrollView style={{ paddingHorizontal: 15, ...style }}>{children}</ScrollView>;
  }

  return <View style={{ paddingHorizontal: 15, ...style }}>{children}</View>;
};

ContentWrap.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any.isRequired,
  scrollable: PropTypes.bool
};

export default ContentWrap;
