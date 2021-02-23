import React from 'react';
import PropTypes from 'prop-types';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { selectPrograms } from 'modules/ducks/itv/itv.selectors';

// eslint-disable-next-line no-unused-vars
const ProgramGuide = ({ programs, getProgramsByChannelAction, channelId }) => {
  // generates an array of dates 7 days from now
  const dates = generateDatesFromToday();
  console.log({ dates });

  const [selected, setSelected] = React.useState('1');

  const handleSelect = (id) => {
    setSelected(id);
    const { value } = dates.find(({ id: dateId }) => dateId === parseInt(id));
    const date = new Date(value).toISOString();
    getProgramsByChannelAction({ channelId, date });
    // console.log({ id, dateObj });
  };

  return (
    <React.Fragment>
      <SelectorPills
        data={dates}
        labelkey="formatted"
        onSelect={handleSelect}
        selected={selected}
      />
      {programs.map(({ id, ...programProps }) => (
        <ProgramItem key={id} {...programProps} />
      ))}
    </React.Fragment>
  );
};

ProgramGuide.propTypes = {
  channelId: PropTypes.string,
  getProgramsByChannelAction: PropTypes.func,
  programs: PropTypes.array
};

const actions = {
  getProgramsByChannelAction: Creators.getProgramsByChannel
};

const mapStateToProps = createStructuredSelector({ programs: selectPrograms });

export default connect(mapStateToProps, actions)(ProgramGuide);
