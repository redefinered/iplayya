/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import ProgramGuideComponent from 'components/program-guide/program-guide.component';
import ItemContent from './item-content.component';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { createStructuredSelector } from 'reselect';
import { selectChannel } from 'modules/ducks/itv/itv.selectors';
import { selectCurrentProgram } from 'modules/ducks/itv/itv.selectors';
import { urlEncodeTitle } from 'utils';
import { compose } from 'redux';

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

  React.useEffect(() => {
    let date = new Date(Date.now());
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

  if (!channel) return <View />;

  return (
    <View style={styles.root}>
      <ContentWrap>
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

      <ProgramGuideComponent channelId={channelId} />
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
