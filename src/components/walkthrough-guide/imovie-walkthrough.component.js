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
        heightValue={172}
        bottomPosValue={-43}
        trianglePosition="center"
        containerPosition="flex-start"
        topPadding={180}
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
        heightValue={152}
        topPosValue={-5}
        trianglePosition="flex-end"
        rightPadding={20}
        containerPosition="flex-start"
        topPadding={110}
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
        heightValue={152}
        bottomPosValue={-40}
        trianglePosition="center"
        containerPosition="flex-end"
        bottomPadding={80}
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
