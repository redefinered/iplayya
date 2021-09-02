/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import ProgramGuideComponent from 'components/program-guide/program-guide.component';
import ItemContent from './item-content.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { createStructuredSelector } from 'reselect';
import { selectChannel } from 'modules/ducks/itv/itv.selectors';
import { selectCurrentProgram } from 'modules/ducks/itv/itv.selectors';
import { urlEncodeTitle } from 'utils';
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
  currentProgram,
  route: {
    params: { channelId }
  },

  getChannelAction,
  getProgramsByChannelAction
}) => {
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);
  const [isFavorite] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(null);
  const [showSnackBar, setShowSnackBar] = React.useState(false);

  React.useEffect(() => {
    // let date = new Date(moment().startOf('day'));
    let date = new Date(moment());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
    getChannelAction({ videoId: channelId });
  }, []);

  React.useEffect(() => {
    if (channel && currentProgram) {
      const { title: epgtitle, time, time_to } = currentProgram;
      const data = {
        title: channel.title,
        epgtitle,
        time,
        time_to,
        thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Program Title')}`
      };
      setCurrentlyPlaying(data);
    }
  }, [channel, currentProgram]);

  const handleFovoritePress = () => {
    console.log('add to favorites');
  };

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
            <Image
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
              source={{
                url: 'http://via.placeholder.com/60x60.png'
              }}
            />
            <ItemContent
              {...currentlyPlaying}
              channeltitle={channel.title}
              onRightActionPress={handleFovoritePress}
              isFavorite={isFavorite}
            />
          </View>
        </View>
      </ContentWrap>

      <ProgramGuideComponent
        contentHeight={contentHeight}
        channelId={channelId}
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
  channel: selectChannel,
  currentProgram: selectCurrentProgram
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
