import React from 'react';
import { View } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

export default function withHeaderPush(WrappedComponent, options = {}) {
  const { backgroundType, gradientTypeColors } = options;
  // console.log('')
  const HeaderPush = () => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <View style={{ flex: 1, paddingTop: headerHeight }}>
          <WrappedComponent />
        </View>
      </ScreenContainer>
    );
  };

  return HeaderPush;
}
