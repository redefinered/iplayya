import React from 'react';
import ScreenContainer from 'components/screen-container.component';

export default function withScreenContainer(WrappedComponent, options = {}) {
  const { backgroundType, gradientTypeColors } = options;
  const screenContainer = () => {
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <WrappedComponent />
      </ScreenContainer>
    );
  };

  return screenContainer;
}
