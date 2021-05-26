/* eslint-disable react/prop-types */

import React from 'react';
import { View } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const withHeaderPush = (options = {}) => (WrappedComponent) => {
  let { backgroundType, gradientTypeColors, withLoader } = options;
  // console.log({ backgroundType, gradientTypeColors, withLoader });

  const headerPush = ({ isFetching, ...otherProps }) => {
    const headerHeight = useHeaderHeight();
    return (
      // <ScreenContainer
      //   backgroundType={backgroundType}
      //   gradientTypeColors={gradientTypeColors}
      //   withLoader={withLoader}
      //   isFetching={isFetching}
      // >

      // </ScreenContainer>
      <View style={{ flex: 1, marginTop: headerHeight }}>
        <WrappedComponent isFetching={isFetching} {...otherProps} />
      </View>
    );
  };

  return headerPush;
};

export default withHeaderPush;
