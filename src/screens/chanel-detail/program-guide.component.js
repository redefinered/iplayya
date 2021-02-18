import React from 'react';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';

import sampledata from './sampledata.json';

const { programs } = sampledata;

const ProgramGuide = () => {
  // generates an array of dates 7 days from now
  const dates = generateDatesFromToday();

  const [selected, setSelected] = React.useState('1');

  const handleSelect = (id) => {
    setSelected(id);
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

export default ProgramGuide;
