import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, FlatList } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { createFontFormat } from 'utils';

const ITEM_HEIGHT = 34;

const CategorySelectorPills = ({ data, labelkey, onSelect, selected, screen }) => {
  const theme = useTheme();

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index
  });

  return (
    <FlatList
      style={{ paddingBottom: screen ? 40 : 0, marginBottom: theme.spacing(2) }}
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      getItemLayout={getItemLayout}
      renderItem={({ item: { id, ...d } }) => (
        <Pill
          id={id.toString()}
          label={d[labelkey]}
          onSelect={onSelect}
          selected={selected}
          {...d}
        />
      )}
    />
  );
};

CategorySelectorPills.propTypes = {
  data: PropTypes.array,
  labelkey: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  screen: PropTypes.bool,
  style: PropTypes.object
};

CategorySelectorPills.defaultProps = {
  labelkey: 'label'
};

const Pill = ({ id, label, selected, onSelect }) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onSelect(id)}
      style={{
        justifyContent: 'center',
        marginLeft: theme.spacing(2),
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: ITEM_HEIGHT,
        borderRadius: 34,
        marginBottom: theme.spacing(2)
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
  selected: 'all'
};

export default React.memo(CategorySelectorPills);
