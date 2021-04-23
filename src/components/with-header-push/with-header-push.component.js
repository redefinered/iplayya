import React from 'react';
import { View } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const withHeaderPush = (options = {}) => (WrappedComponent) => {
  const { backgroundType, gradientTypeColors, withLoader } = options;
  const headerPush = (props) => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer
        backgroundType={backgroundType}
        gradientTypeColors={gradientTypeColors}
        withLoader={withLoader}
      >
        <View style={{ flex: 1, marginTop: headerHeight }}>
          <WrappedComponent {...props} />
        </View>
      </ScreenContainer>
    );
  };

  return headerPush;
};

export default withHeaderPush;
