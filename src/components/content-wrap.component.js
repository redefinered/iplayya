import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

const ContentWrap = ({ children, style, scrollable }) => {
  const theme = useTheme();
  if (scrollable) {
    return (
      <ScrollView style={{ paddingHorizontal: theme.spacing(2), ...style }}>{children}</ScrollView>
    );
  }

  return <View style={{ paddingHorizontal: theme.spacing(2), ...style }}>{children}</View>;
};

ContentWrap.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any.isRequired,
  scrollable: PropTypes.bool
};

export default ContentWrap;
