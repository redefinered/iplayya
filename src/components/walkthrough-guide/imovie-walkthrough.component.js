import React from 'react';
import PropTypes from 'prop-types';
import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';

const ImovieWalkThrough = ({ visible, onButtonClick }) => {
  const [stepTwo, setStepTwo] = React.useState(false);
  const [stepThree, setStepThree] = React.useState(false);

  const handleVisible = () => {
    onButtonClick();
  };

  const handleNextModal = () => {
    onButtonClick();
    setStepTwo(true);
  };

  const hideStepTwo = () => {
    setStepTwo(false);
  };

  const handleThreeModal = () => {
    setStepTwo(false);
    setStepThree(true);
  };

  const hideStepThree = () => {
    setStepThree(false);
  };

  return (
    <React.Fragment>
      <WalkThroughGuide
        visible={visible}
        hideModal={handleVisible}
        nextModal={handleNextModal}
        title="Browse movies"
        content="Explore all the movies by browsing on different movie categories."
        skip="Skip"
        skipValue="- 1 of 3"
        next="Next"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        topValue={0.25}
        heightValue={0.25}
        bottomPosValue={-43}
        trianglePosition="center"
        rotateArrow="178deg"
      />
      <WalkThroughGuide
        visible={stepTwo}
        hideModal={hideStepTwo}
        nextModal={handleThreeModal}
        title="Search movies"
        content="Tap here to find movies you want to watch."
        skip="Skip"
        skipValue="- 2 of 3"
        next="Next"
        topWidth={20}
        rightWidth={20}
        leftWidth={20}
        topValue={0.15}
        heightValue={0.2}
        topPosValue={-5}
        trianglePosition="flex-end"
        rightPadding={20}
        rotateArrow="90deg"
      />
      <WalkThroughGuide
        visible={stepThree}
        disabled={true}
        nextModal={hideStepThree}
        title="Back to Home"
        content="Tap here to go back to Home."
        skipValue="3 of 3"
        next="Got It"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        topValue={0.79}
        heightValue={0.2}
        bottomPosValue={-40}
        trianglePosition="center"
        rotateArrow="178deg"
      />
    </React.Fragment>
  );
};

ImovieWalkThrough.propTypes = {
  visible: PropTypes.bool,
  onButtonClick: PropTypes.func
};

export default ImovieWalkThrough;
