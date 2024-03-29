/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, FlatList } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { ScrollView } from 'react-native-gesture-handler';

const ITEM_WIDTH = 110;
const ITEM_WIDTH_WITH_OFFSET = 110 + 12;
const ITEM_HEIGHT = 34;

const SelectorPills = ({ data, labelkey, onSelect, screen }) => {
  const theme = useTheme();
  const [selected, setSelected] = React.useState('8');

  const handlePress = (selected) => {
    setSelected(selected);

    onSelect(selected.toString());
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH_WITH_OFFSET,
    offset: ITEM_WIDTH_WITH_OFFSET * index,
    index
  });

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, formatted } }) => {
    return (
      <Pressable
        onPress={() => handlePress(id)}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: theme.spacing(2),
          backgroundColor:
            selected === id.toString()
              ? theme.iplayya.colors.vibrantpussy
              : theme.iplayya.colors.white25,
          height: ITEM_HEIGHT,
          width: ITEM_WIDTH,
          borderRadius: ITEM_HEIGHT
        }}
      >
        <Text style={{ ...createFontFormat(12, 16) }}>{formatted}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      // eslint-disable-next-line react/prop-types
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      getItemLayout={getItemLayout}
      initialScrollIndex={7}
      renderItem={renderItem}
      style={{
        marginBottom: theme.spacing(2),
        height: ITEM_HEIGHT
      }}
    />
  );
};

SelectorPills.propTypes = {
  data: PropTypes.array,
  labelkey: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  screen: PropTypes.bool,
  style: PropTypes.object
};

SelectorPills.defaultProps = {
  labelkey: 'label'
};

// const Pill = ({ id, label, selected, onSelect }) => {
//   const theme = useTheme();
//   return (
//     <Pressable
//       onPress={() => onSelect(id.toString())}
//       style={{
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginLeft: theme.spacing(2),
//         // paddingHorizontal: 15,
//         backgroundColor:
//           selected === id.toString()
//             ? theme.iplayya.colors.vibrantpussy
//             : theme.iplayya.colors.white25,
//         height: ITEM_HEIGHT,
//         width: ITEM_WIDTH,
//         borderRadius: ITEM_HEIGHT
//       }}
//     >
//       <Text style={{ ...createFontFormat(12, 16) }}>{label}</Text>
//     </Pressable>
//   );
// };

// Pill.propTypes = {
//   id: PropTypes.string,
//   label: PropTypes.string,
//   selected: PropTypes.string,
//   onSelect: PropTypes.func
// };

// Pill.defaultProps = {
//   selected: 'all'
// };

export default React.memo(SelectorPills);
