import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
import { createFontFormat } from 'utils';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';

const ITEM_HEIGHT = 34;

const CategorySelectorPills = ({ index, data, labelkey, onSelect, selected, screen }) => {
  const pills = React.useRef(null);
  const theme = useTheme();

  const [itemWidths, setItemWidths] = React.useState([]);
  const [pillsOffset, setPillsOffset] = React.useState(0);

  React.useEffect(() => {
    // stop if pills is null
    if (!pills.current) return;

    // stop if pills are not rendered and itemWidths are empty
    if (!itemWidths.length) return;

    // do not execute while all pill are not yet rendered
    if (itemWidths.length !== data.length) return;

    // adds item widths and set it as offset depending on the index of the selected category
    let offset = 0;
    for (let i = 0; i < index; i++) {
      const el = itemWidths[i];

      if (!el) continue;
      offset = offset + el.w;
    }

    setPillsOffset(offset);
  });

  React.useEffect(() => {
    // whenever the offset is changed, scroll to that offset
    pills.current.scrollToOffset({ offset: pillsOffset, animated: false });
  }, [pillsOffset]);

  const handlePillOnLayout = (e, { id, number }) => {
    if (!id) return;

    /// collects all item widths
    const ws = uniqBy([{ id, number, w: e.nativeEvent.layout.width + 12 }, ...itemWidths], 'id'); // 12 is the space between each pill
    const ordered = orderBy(ws, 'number', 'asc');

    setItemWidths(ordered);
  };

  return (
    <React.Fragment>
      <FlatList
        ref={pills}
        style={{
          height: 34,
          paddingBottom: screen ? 40 : 0,
          marginBottom: theme.spacing(2)
        }}
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: { id, ...d } }) => (
          <Pill
            id={id.toString()}
            onLayout={(e) => handlePillOnLayout(e, { id, ...d })}
            label={d[labelkey]}
            onSelect={onSelect}
            selected={selected}
            {...d}
          />
        )}
      />
    </React.Fragment>
  );
};

CategorySelectorPills.propTypes = {
  data: PropTypes.array,
  index: PropTypes.number,
  labelkey: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  screen: PropTypes.bool,
  style: PropTypes.object
};

CategorySelectorPills.defaultProps = {
  labelkey: 'label'
};

const Pill = ({ id, label, selected, onSelect, ...otherProps }) => {
  const theme = useTheme();
  return (
    <TouchableRipple
      onPress={() => onSelect(id)}
      style={{
        justifyContent: 'center',
        marginLeft: theme.spacing(2),
        paddingHorizontal: 15,
        backgroundColor:
          selected === id ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white25,
        height: ITEM_HEIGHT,
        borderRadius: 34
      }}
      {...otherProps}
    >
      <Text style={{ ...createFontFormat(12, 16) }}>{label}</Text>
    </TouchableRipple>
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
