import React from 'react';
import ScreenContainer from 'components/screen-container.component';

const withScreenContainer = (backgroundType, gradientTypeColors) => (WrappedComponent) => {
  const screenContainer = (props) => {
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <WrappedComponent {...props} />
      </ScreenContainer>
    );
  };

  return screenContainer;
};

export default withScreenContainer;
