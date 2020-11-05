import React from 'react';
import { View } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const withHeaderPush = (backgroundType, gradientTypeColors) => (WrappedComponent) => {
  const headerPush = (props) => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <View style={{ flex: 1, paddingTop: headerHeight }}>
          <WrappedComponent {...props} />
        </View>
      </ScreenContainer>
    );
  };

  return headerPush;
};

export default withHeaderPush;
