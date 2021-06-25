import React from 'react';
import PropTypes from 'prop-types';
import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';

const HomeGuide = ({ visible, onButtonTouch }) => {
  const [modalTwo, setModalTwo] = React.useState(false);
  const [modalThree, setModalThree] = React.useState(false);

  const handleVisible = () => {
    onButtonTouch();
  };

  const handleNextModal = () => {
    onButtonTouch();
    setModalTwo(true);
  };

  const OpenModal = () => {
    setModalTwo(false);
    setModalThree(true);
  };

  const closeThree = () => {
    setModalThree(false);
  };

  return (
    <React.Fragment>
      <WalkThroughGuide
        visible={visible}
        hideModal={handleVisible}
        nextModal={handleNextModal}
        title="iPlayya tour"
        addLine={false}
        content="On this section you can select a feature that you would like to take."
        nextLine="If you prefer to take this tour later, you can access it in your account settings"
        skip="Skip"
        skipValue="- 1 of 3"
        next="Next"
        topWidth={25}
        rightWidth={15}
        leftWidth={15}
        topValue={0.6}
        heightValue={0.31}
        topPosValue={-15}
        trianglePosition="center"
        rotateArrow="180deg"
      />
      <WalkThroughGuide
        visible={modalTwo}
        hideModal={handleVisible}
        nextModal={OpenModal}
        title="Manage IPTV"
        content="Go here to manage or add your IPTV provider."
        skip="Skip"
        skipValue="- 2 of 3"
        next="Next"
        bottomWidth={30}
        rightWidth={15}
        leftWidth={14}
        topValue={0.74}
        heightValue={0.23}
        bottomPosValue={-35}
        trianglePosition="flex-start"
        leftPadding={40}
        rotateArrow="160deg"
      />
      <WalkThroughGuide
        visible={modalThree}
        disabled={true}
        nextModal={closeThree}
        title="Manage account"
        content="You can change your account settings and manage your profile here."
        skipValue="3 of 3"
        next="Next"
        bottomWidth={25}
        rightWidth={14}
        leftWidth={14}
        topValue={0.74}
        heightValue={0.23}
        bottomPosValue={-38}
        trianglePosition="flex-end"
        rightPadding={45}
        rotateArrow="195deg"
      />
    </React.Fragment>
  );
};

HomeGuide.propTypes = {
  visible: PropTypes.bool,
  onButtonTouch: PropTypes.func
};

export default HomeGuide;
