import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { createFontFormat } from 'utils';

const SelectorPills = ({ data, labelkey, onSelect, selected }) => {
  return (
    <ScrollView horizontal style={{ paddingHorizontal: 15, marginVertical: 20 }}>
      {data.map((d) => {
        const { id, ...itemProps } = d;
        return (
          <Pill
            key={id}
            id={id.toString()}
            label={d[labelkey]}
            {...itemProps}
            onSelect={onSelect}
            selected={selected}
          />
        );
      })}
    </ScrollView>
  );
};

SelectorPills.propTypes = {
  data: PropTypes.array,
  labelkey: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string
};

SelectorPills.defaultProps = {
  labelkey: 'label'
};

const Pill = ({ id, label, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onSelect(id)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: 34,
        borderRadius: 34,
        marginRight: 10
      }}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{label}</Text>
    </Pressable>
  );
};

Pill.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

Pill.defaultProps = {
  selected: '1'
};

export default SelectorPills;
