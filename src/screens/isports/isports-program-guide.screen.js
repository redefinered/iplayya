/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'components/icon/icon.component';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import ProgramGuideComponent from 'components/program-guide/program-guide.component';
import CurrentProgram from './isports-current-program.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/isports/isports.actions';
import { createStructuredSelector } from 'reselect';
import { selectChannel, selectPrograms } from 'modules/ducks/isports/isports.selectors';
import { compose } from 'redux';
import moment from 'moment';
import theme from 'common/theme';

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

const ProgramGuide = ({
  channel,
  programs,
  route: {
    params: { channelId }
  },

  getChannelAction,
  getProgramsByChannelAction
}) => {
  const [contentHeight, setContentHeight] = React.useState(null);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [currentProgram, setCurrentProgram] = React.useState(null);

  React.useEffect(() => {
    if (!programs.length) return;

    setCurrentProgram(programs[0]);
  }, [programs]);

  React.useEffect(() => {
    // let date = new Date(moment().startOf('day'));
    let date = new Date(moment());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
    getChannelAction({ videoId: channelId });
  }, []);

  const handleShowSnackBar = () => {
    setShowSnackBar(true);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  if (!channel) return <View />;

  return (
    <View style={styles.root}>
      <ContentWrap onLayout={({ nativeEvent }) => setContentHeight(nativeEvent.layout.height)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                marginRight: 10,
                backgroundColor: theme.iplayya.colors.white10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
            </View>
            <CurrentProgram channel={channel} currentProgram={currentProgram} />
          </View>
        </View>
      </ContentWrap>

      <ProgramGuideComponent
        contentHeight={contentHeight}
        channelId={channelId}
        programs={programs}
        channelName={channel.title}
        showSnackBar={handleShowSnackBar}
        screen
      />
      <SnackBar
        visible={showSnackBar}
        message="We will remind you before the program start."
        iconName="notifications"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ProgramGuide {...props} />
  </ScreenContainer>
);

const actions = {
  getChannelAction: Creators.getChannel,
  getProgramsByChannelAction: Creators.getProgramsByChannel
};

const mapStateToProps = createStructuredSelector({
  programs: selectPrograms,
  channel: selectChannel
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
