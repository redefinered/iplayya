import * as React from 'react';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import moment from 'moment';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    borderRadius: 8,
    marginTop: 17
  },
  textDate: {
    fontSize: 16
  },
  textFocus: {
    fontSize: 16,
    fontFamily: 'NotoSans',
    color: '#ffffff'
  },
  textBlur: {
    fontSize: 16,
    fontFamily: 'NotoSans',
    color: theme.iplayya.colors.white50
  },
  dateIcon: {
    marginRight: 10,
    marginTop: -2
  },
  textHolderBlur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: theme.iplayya.colors.white10
  },
  textHolderFocus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: theme.iplayya.colors.white25
  }
});

const DatePicker = ({ setBirthdate, style, placeholder }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [chosenDate, setChosenDate] = React.useState(placeholder); // moment().format('LL')

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker(); //must be first
    // console.log('A date has been picked: ', datetime);
    setChosenDate(moment(date).format('LL'));
  };

  React.useEffect(() => {
    setBirthdate(chosenDate);
  }, [chosenDate]);

  return (
    <TouchableRipple
      borderless={true}
      style={{ ...styles.textContainer, ...style }}
      onPress={() => showDatePicker()}
    >
      <View style={isDatePickerVisible ? styles.textHolderFocus : styles.textHolderBlur}>
        <Text style={chosenDate === placeholder ? styles.textBlur : styles.textFocus}>
          {chosenDate}
        </Text>
        <View style={styles.dateIcon}>
          <Icon name="birthday" size={theme.iconSize(3)} />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </TouchableRipple>
  );
};

DatePicker.propTypes = {
  placeholder: PropTypes.string,
  setBirthdate: PropTypes.func,
  style: PropTypes.object
};

export default DatePicker;
