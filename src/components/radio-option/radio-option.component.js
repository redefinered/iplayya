import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';

const styles = StyleSheet.create({
  settingItem: {
    paddingVertical: 10
  }
});

const RadioOption = ({ choices, currentValue, onSelect }) => {
  const [checked, setChecked] = React.useState(currentValue);

  React.useEffect(() => {
    onSelect(checked);
  }, [checked]);

  return (
    <View style={styles.settingItem}>
      <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 10 }}>Video Quality</Text>
      {choices.map(({ label, value }) => (
        <Pressable
          onPress={() => setChecked(value)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5
          }}
          key={label}
        >
          <Text>{label}</Text>
          <RadioButton
            value={value}
            status={checked === value ? 'checked' : 'unchecked'}
            onPress={() => setChecked(value)}
          />
        </Pressable>
      ))}
    </View>
  );
};

RadioOption.propTypes = {
  choices: PropTypes.array.isRequired,
  currentValue: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

export default RadioOption;
