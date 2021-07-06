import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1 },
  // form: { flex: 6 },
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' },
  loginButton: { marginTop: 6 },
  forgotPassword: { padding: 15, marginVertical: 20 },
  forgotPasswordText: { alignSelf: 'center', marginTop: 10 },
  signUpText: { color: '#E34398' },
  helpText: { alignSelf: 'center' },
  showToggleContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40
  },
  showToggleIcon: { color: 'rgba(255,255,255,0.5)' },
  passwordInputContainer: { position: 'relative' }
});
