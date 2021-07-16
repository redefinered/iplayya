import * as React from 'react';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import moment from 'moment';
import Icon from 'components/icon/icon.component';

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
    color: '#ffffff'
  },
  textBlur: {
    color: 'rgba(255,255,255,0.3)'
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
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  textHolderFocus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.3)'
  }
});

const DatePicker = ({ setBirthdate, style }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [chosenDate, setChosenDate] = React.useState(
    moment(new Date()).localeData().longDateFormat('L').toLowerCase()
  ); // moment().format('LL')

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (datetime) => {
    hideDatePicker(); //must be first
    // console.log('A date has been picked: ', datetime);
    setChosenDate(moment(datetime).format('LL'));
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
      <View
        style={
          chosenDate === moment(new Date()).localeData().longDateFormat('L').toLowerCase()
            ? styles.textHolderBlur
            : styles.textHolderFocus
        }
      >
        <Text
          style={
            chosenDate === moment(new Date()).localeData().longDateFormat('L').toLowerCase()
              ? styles.textBlur
              : styles.textFocus
          }
        >
          {chosenDate}
        </Text>
        <View style={styles.dateIcon}>
          <Icon name="birthday" size={24} />
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
  setBirthdate: PropTypes.func,
  style: PropTypes.object
};

export default DatePicker;
