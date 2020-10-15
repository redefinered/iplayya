import React from 'react';
import { View } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

export default function withHeaderPush(WrappedComponent) {
  const HeaderPush = () => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer>
        <View style={{ paddingTop: headerHeight }}>
          <WrappedComponent />
        </View>
      </ScreenContainer>
    );
  };

  return HeaderPush;
}
