import React from 'react';
import PropTypes from 'prop-types';
import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';

const ItvWalkThrough = ({ visible, onButtonClick }) => {
  const [stepTwo, setStepTwo] = React.useState(false);
  const [stepThree, setStepThree] = React.useState(false);
  const [stepFour, setStepFour] = React.useState(false);
  const [stepFive, setStepFive] = React.useState(false);
  const [stepSix, setStepSix] = React.useState(false);
  const [stepSeven, setStepSeven] = React.useState(false);

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

  const handleFourModal = () => {
    setStepThree(false);
    setStepFour(true);
  };

  const hideStepFour = () => {
    setStepFour(false);
  };

  const handleFiveModal = () => {
    setStepFour(false);
    setStepFive(true);
  };

  const hideStepFive = () => {
    setStepFive(false);
  };

  const handleSixModal = () => {
    setStepFive(false);
    setStepSix(true);
  };

  const hideStepSix = () => {
    setStepSix(false);
  };

  const handleSevenModal = () => {
    setStepSix(false);
    setStepSeven(true);
  };

  const hideStepSeven = () => {
    setStepSeven(false);
  };

  return (
    <React.Fragment>
      <WalkThroughGuide
        visible={visible}
        hideModal={handleVisible}
        nextModal={handleNextModal}
        title="Browse channels"
        content="Explore all the TV channels by browsing on different categories."
        skip="Skip"
        skipValue="- 1 of 7"
        next="Next"
        topWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={172}
        topPosValue={-15}
        trianglePosition="flex-start"
        leftPadding={20}
        containerPosition="flex-start"
        topPadding={210}
        rotateArrow="180deg"
      />
      <WalkThroughGuide
        visible={stepTwo}
        hideModal={hideStepTwo}
        nextModal={handleThreeModal}
        title="Search Channel"
        content="Tap here to find channels you want to watch."
        skip="Skip"
        skipValue="- 2 of 7"
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
        hideModal={hideStepThree}
        nextModal={handleFourModal}
        title="Notify"
        content="You can activate this bell to get notification on featured channels."
        skip="Skip"
        skipValue="- 3 of 7"
        next="Next"
        topWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={172}
        topPosValue={-15}
        trianglePosition="center"
        leftPadding={55}
        containerPosition="center"
        topPadding={375}
        rotateArrow="180deg"
      />
      <WalkThroughGuide
        visible={stepFour}
        hideModal={hideStepFour}
        nextModal={handleFiveModal}
        title="Add to Favorites"
        content="Tap here to add the TV channel to your Favorites list."
        skip="Skip"
        skipValue="- 4 of 7"
        next="Next"
        topWidth={15}
        rightWidth={15}
        leftWidth={15}
        heightValue={172}
        bottomPosValue={-40}
        trianglePosition="flex-end"
        rightPadding={8}
        containerPosition="flex-start"
        topPadding={355}
        rotateArrow="90deg"
      />
      <WalkThroughGuide
        visible={stepFive}
        hideModal={hideStepFive}
        nextModal={handleSixModal}
        title="Program guide"
        content="Go here to view TV program schedules."
        skip="Skip"
        skipValue="- 5 of 7"
        next="Next"
        topWidth={15}
        rightWidth={15}
        leftWidth={15}
        heightValue={152}
        bottomPosValue={-40}
        trianglePosition="flex-end"
        rightPadding={8}
        containerPosition="flex-end"
        bottomPadding={120}
        rotateArrow="90deg"
      />
      <WalkThroughGuide
        visible={stepSix}
        hideModal={hideStepSix}
        nextModal={handleSevenModal}
        title="Remote control"
        content="Tap this section to use the remote control."
        skip="Skip"
        skipValue="- 6 of 7"
        next="Next"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={152}
        bottomPosValue={-40}
        trianglePosition="center"
        containerPosition="flex-end"
        bottomPadding={90}
        rotateArrow="178deg"
      />
      <WalkThroughGuide
        visible={stepSeven}
        disabled={true}
        nextModal={hideStepSeven}
        title="Back to Home"
        content="Tap here to go back to Home."
        skipValue="7 of 7"
        next="Got It"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        heightValue={152}
        bottomPosValue={-40}
        trianglePosition="center"
        containerPosition="flex-end"
        bottomPadding={70}
        rotateArrow="178deg"
      />
    </React.Fragment>
  );
};

ItvWalkThrough.propTypes = {
  visible: PropTypes.bool,
  onButtonClick: PropTypes.func
};

export default ItvWalkThrough;
