import React from 'react';
import ScreenContainer from 'components/screen-container.component';

const withScreenContainer = (config) => (WrappedComponent) => {
  console.log({ config });
  let { backgroundType, withLoader, test } = config;

  console.log({ test });

  // eslint-disable-next-line react/prop-types
  const screenContainer = ({ isFetching, ...otherProps }) => {
    return (
      <ScreenContainer
        backgroundType={backgroundType}
        withLoader={withLoader}
        isFetching={isFetching}
      >
        <WrappedComponent isFetching={isFetching} {...otherProps} />
      </ScreenContainer>
    );
  };

  return screenContainer;
};

export default withScreenContainer;
