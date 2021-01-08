import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { List, Text, withTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  settingItem: {
    paddingVertical: 10
  }
});

const DropdownOption = ({ theme, choices, optionLabel, onSelect, currentValue }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState(currentValue);

  const handleSelect = (c) => {
    setSelected(c);
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    onSelect(selected);
  }, [selected]);

  return (
    <View style={styles.settingItem}>
      <Text style={{ fontSize: 16, lineHeight: 22 }}>{optionLabel}</Text>
      <List.Accordion
        title={selected ? selected.label : 'Select one'}
        style={{ paddingLeft: 0, paddingRight: 0 }}
        titleStyle={{ color: theme.iplayya.colors.strongpussy, marginLeft: -7 }}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
        {choices.map((c) => (
          <List.Item key={c.key} title={c.label} onPress={() => handleSelect(c)} />
        ))}
      </List.Accordion>
    </View>
  );
};

DropdownOption.propTypes = {
  theme: PropTypes.object.isRequired,
  optionLabel: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  currentValue: PropTypes.object
};

export default withTheme(DropdownOption);
