import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { selectPrograms, selectNotifications } from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';

// eslint-disable-next-line no-unused-vars
const ProgramGuide = ({ programs, notifications, getProgramsByChannelAction, channelId }) => {
  const theme = useTheme();
  // generates an array of dates 7 days from now
  const dates = generateDatesFromToday();
  // console.log({ dates });

  const [selected, setSelected] = React.useState('1');

  const handleSelect = (id) => {
    setSelected(id);
    const { value } = dates.find(({ id: dateId }) => dateId === parseInt(id));
    const date = new Date(value).toISOString();
    getProgramsByChannelAction({ channelId, date });
    // console.log({ id, dateObj });
  };

  const renderTitle = () => {
    if (typeof title === 'undefined') return;

    return (
      <ContentWrap>
        <Text style={{ ...createFontFormat(16, 22), marginBottom: theme.spacing(2) }}>
          Program Guide
        </Text>
      </ContentWrap>
    );
  };

  // return empty componet if no available programs
  if (!programs.length) return <View />;

  const isNotificationActive = (id) => {
    /// return false if notifications is empty
    if (!notifications.length) return false;

    const program = notifications.find((prog) => id === prog.id);

    /// return false if the program is no yet in notifications
    if (typeof program === 'undefined') return false;

    if (!program.active) return false;

    return true;
  };

  const isInNotifications = (notifId) => {
    const notif = notifications.find(({ id }) => id === notifId);

    /// if not found return false
    if (typeof notif === 'undefined') return false;

    return true;
  };

  return (
    <View>
      {renderTitle()}

      <SelectorPills
        data={dates}
        labelkey="formatted"
        onSelect={handleSelect}
        selected={selected}
        style={{ marginBottom: theme.spacing(2) }}
      />
      {programs.map((program, key) => (
        <ProgramItem
          channelId={channelId}
          exists={isInNotifications(program.id)}
          isActive={isNotificationActive(program.id)}
          key={key}
          {...program}
        />
      ))}
    </View>
  );
};

ProgramGuide.propTypes = {
  channelId: PropTypes.string,
  getProgramsByChannelAction: PropTypes.func,
  programs: PropTypes.array,
  notifications: PropTypes.array
};

const actions = {
  getProgramsByChannelAction: Creators.getProgramsByChannel
};

const mapStateToProps = createStructuredSelector({
  programs: selectPrograms,
  notifications: selectNotifications
});

export default connect(mapStateToProps, actions)(ProgramGuide);
