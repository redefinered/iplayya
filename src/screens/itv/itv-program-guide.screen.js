/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import ProgramGuideComponent from 'components/program-guide/program-guide.component';
import CurrentProgram from './itv-current-program.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { createStructuredSelector } from 'reselect';
import { selectChannel, selectPrograms } from 'modules/ducks/itv/itv.selectors';
import { compose } from 'redux';
import theme from 'common/theme';
import { selectIsFetching } from 'modules/ducks/itv/itv.selectors';
import { generateDatesFromToday } from 'utils';

const TODAY = new Date().toISOString();

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

const ProgramGuide = ({
  isFetching,
  channel,
  getChannelAction,
  route: {
    params: { channelId }
  }
}) => {
  const [contentHeight, setContentHeight] = React.useState(null);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [currentProgram, setCurrentProgram] = React.useState(null);
  const [date, setDate] = React.useState(TODAY);

  const handleDateSelect = (dateId) => {
    /// generate dates
    let dates = generateDatesFromToday();

    /// convert date ids to string
    dates = dates.map(({ id, ...rest }) => ({ id: id.toString(), ...rest }));

    /// get the date's value
    const { value } = dates.find(({ id }) => id === dateId);

    /// convert the date's value to string
    const d = new Date(value).toISOString();

    setDate(d);
  };

  React.useEffect(() => {
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

  const renderCurrentProgram = () => {
    if (isFetching) return;
    return <CurrentProgram channel={channel} currentProgram={currentProgram} />;
  };

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
            {renderCurrentProgram()}
          </View>
        </View>
      </ContentWrap>

      <ProgramGuideComponent
        date={date}
        handleDateSelect={handleDateSelect}
        contentHeight={contentHeight}
        channelId={channelId}
        channelName={channel.title}
        showSnackBar={handleShowSnackBar}
        setCurrentProgram={setCurrentProgram}
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
  channel: selectChannel,
  isFetching: selectIsFetching
});

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
