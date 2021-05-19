import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  textInput: { backgroundColor: 'red' },
  textUnfocus: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, marginTop: 18 },
  textInputFocus: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, marginTop: 18 },
  textChangeColor: { color: 'rgba(255,255,255,0.25)' },
  textUnchange: { color: '#ffffff' },
  errorText: { borderWidth: 1, borderColor: '#E34398' },
  submit: { marginBottom: 30, marginTop: 30 }
});
