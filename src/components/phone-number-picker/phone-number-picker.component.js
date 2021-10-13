import React from 'react';
import { View /*StyleSheet*/ } from 'react-native';
import PropTypes from 'prop-types';
import PhoneInput from 'react-native-phone-input';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal';
import { useTheme } from 'react-native-paper';

const PhoneNumberPicker = ({ setPhone, placeholder }) => {
  const [value, setValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

  let phone = React.useRef(null);

  const switchVisible = () => setVisible(!visible);

  const onPhoneInputChange = (value, iso2) => {
    console.log('xxx', value, iso2);
    const newState = {
      phoneInputValue: value
    };

    if (iso2) {
      newState.countryCode = iso2?.toUpperCase();
    }

    setValue(newState);
  };

  const selectCountry = (country) => {
    console.log('xxxx', country);

    phone.current.selectCountry(country.cca2.toLowerCase());
    // setState({ cca2: country.cca2 });
  };

  React.useEffect(() => {
    setPhone(value);
  }, [value]);

  return (
    <View
      style={{
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginTop: 5,
        position: 'relative',
        backgroundColor: value === '' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'
      }}
    >
      <PhoneInput
        ref={phone}
        value={value}
        onChange={setValue}
        autoFormat={true}
        initialValue={placeholder}
        textProps={{
          color: value === '' ? 'rgba(255,255,255,0.4)' : '#ffffff',
          selectionColor: '#E34398'
        }}
        textStyle={{ fontSize: 16 }}
        flagStyle={{
          borderRadius: 2,
          borderWidth: 0,
          backgroundColor: theme.iplayya.colors.white10
        }}
        onPressFlag={switchVisible}
        onChangePhoneNumber={onPhoneInputChange}
      />

      <CountryPicker
        theme={DARK_THEME}
        withCallingCode={true}
        withFilter={true}
        withFlagButton={true}
        withCountryNameButton={false}
        onSelect={(v) => selectCountry(v)}
        visible={visible}
        containerButtonStyle={{ opacity: 0, position: 'absolute', top: 0, left: 0 }}
      />
    </View>
  );
};

PhoneNumberPicker.propTypes = {
  placeholder: PropTypes.string,
  setPhone: PropTypes.func
};

export default PhoneNumberPicker;
