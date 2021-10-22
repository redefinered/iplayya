import { StyleSheet } from 'react-native';
import theme from 'common/theme';

export default StyleSheet.create({
  textUnfocus: { backgroundColor: theme.iplayya.colors.white10, borderRadius: 0 },
  textInputFocus: { backgroundColor: theme.iplayya.colors.white25, borderRadius: 0 },
  textChangeColor: { color: theme.iplayya.colors.white50 },
  textUnchange: { color: '#ffffff' },
  errorText: { borderWidth: 1.8, borderColor: '#E34398' },
  submit: { marginBottom: 30, marginTop: 30 }
});
