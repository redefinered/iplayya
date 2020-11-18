import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Headline, Paragraph, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Artwork from 'images/welcome-artwork.svg';
import Button from 'components/button/button.component';

import { compose } from 'redux';

import styles from './welcome-dialog.styles';

const WelcomeDialog = ({ theme, visible, onButtonPress }) => {
  return (
    <Modal transparent visible={visible}>
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
              <Button mode="contained" style={styles.button} onPress={() => onButtonPress()}>
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
  onButtonPress: PropTypes.func
};

export default compose(withTheme)(WelcomeDialog);
