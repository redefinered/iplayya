import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Headline, Paragraph, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Artwork from 'assets/welcome-artwork.svg';
import Button from 'components/button/button.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';

import styles from './welcome-dialog.styles';
import { createStructuredSelector } from 'reselect';
import { selectOnboardinginfo } from 'modules/ducks/profile/profile.selectors';
import { selectCurrentUserId } from 'modules/ducks/auth/auth.selectors';

import clone from 'lodash/clone';

const WelcomeDialog = ({ theme, visible, userId, onButtonPress, updateAction, onboardinginfo }) => {
  const { completed } = onboardinginfo;

  const clonedOnboardinginfo = clone(onboardinginfo);

  const handleButtonPress = () => {
    updateAction({
      id: userId,
      onboardinginfo: JSON.stringify(Object.assign(clonedOnboardinginfo, { completed: true }))
    });
    onButtonPress();
  };

  if (typeof completed !== 'undefined') {
    if (completed) {
      return <View />;
    }
  }

  // if (completed) return <View />;

  // completed is undefined or false

  return (
    <Modal transparent visible={visible} statusBarTranslucent={true}>
      <View style={{ backgroundColor: theme.iplayya.colors.black25, ...styles.container }}>
        <ContentWrap>
          <View style={styles.contentWrap}>
            <Artwork style={styles.artwork} />
            <View style={styles.content}>
              <Headline style={{ color: theme.iplayya.colors.vibrantpussy, ...styles.headline }}>
                Welcome!
              </Headline>
              <Paragraph style={{ color: theme.iplayya.colors.black80, ...styles.paragraph }}>
                Enjoy watching thousands of movies, tv shows, live sports, and even listen to your
                music and online radios with our smart IPTV player.
              </Paragraph>
              <Button mode="contained" style={styles.button} onPress={() => handleButtonPress()}>
                Get Started
              </Button>
            </View>
          </View>
        </ContentWrap>
      </View>
    </Modal>
  );
};

WelcomeDialog.propTypes = {
  theme: PropTypes.object,
  visible: PropTypes.bool,
  onButtonPress: PropTypes.func,
  updateAction: PropTypes.func,
  onboardinginfo: PropTypes.object,
  userId: PropTypes.string
};

const actions = {
  updateAction: Creators.update
};

const mapStateToProps = createStructuredSelector({
  onboardinginfo: selectOnboardinginfo,
  userId: selectCurrentUserId
});

export default compose(withTheme, connect(mapStateToProps, actions))(WelcomeDialog);
