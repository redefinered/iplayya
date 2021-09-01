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

const SelectorPills = ({ data, labelkey, onSelect, selected, screen }) => {
  const theme = useTheme();
  const getItemLayout = (data, index) => ({
    length: ITEM_WIDTH_WITH_OFFSET,
    offset: ITEM_WIDTH_WITH_OFFSET * index,
    index
  });

  return (
    <FlatList
      initialScrollIndex={7}
      style={{
        // paddingBottom: screen ? 40 : 0,
        marginBottom: theme.spacing(2),
        height: 44
      }}
      horizontal
      data={data}
      keyExtractor={(item) => `date-${item.id}`}
      showsHorizontalScrollIndicator={false}
      getItemLayout={getItemLayout}
      renderItem={({ item: { id, ...d } }) => (
        <Pill id={id} label={d[labelkey]} onSelect={onSelect} selected={selected} {...d} />
      )}
    />
    // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    //   {data.map(({ id, ...d }) => {
    //     return (
    //       <Pill
    //         key={id.toString()}
    //         id={id.toString()}
    //         label={d[labelkey]}
    //         onSelect={onSelect}
    //         selected={selected}
    //         {...d}
    //       />
    //     );
    //   })}
    // </ScrollView>
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

const Pill = ({ id, label, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onSelect(id.toString())}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing(2),
        paddingHorizontal: 15,
        backgroundColor:
          selected === id.toString()
            ? theme.iplayya.colors.vibrantpussy
            : theme.iplayya.colors.white25,
        height: ITEM_HEIGHT,
        width: ITEM_WIDTH,
        borderRadius: 34
      }}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{label}</Text>
    </Pressable>
  );
};

Pill.propTypes = {
  id: PropTypes.number,
  label: PropTypes.string,
  selected: PropTypes.string,
  onSelect: PropTypes.func
};

Pill.defaultProps = {
  selected: 'all'
};

export default React.memo(SelectorPills);
