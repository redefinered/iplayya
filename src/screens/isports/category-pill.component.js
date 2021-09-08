import React from 'react';
import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { createFontFormat } from 'utils';

// eslint-disable-next-line react/prop-types
const CategoryPill = ({ id, name, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      key={id}
      onPress={() => onSelect(id)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: 34,
        borderRadius: 34,
        marginRight: 10,
        marginBottom: 30
      }}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{name}</Text>
    </Pressable>
  );
};

CategoryPill.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

export default CategoryPill;
