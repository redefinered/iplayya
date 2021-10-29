import { StyleSheet } from 'react-native';
import theme from 'common/theme';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  contentWrap: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  content: { flexDirection: 'row', paddingTop: 25, paddingBottom: 27 },
  iconWrap: { paddingLeft: 46, paddingRight: 12 },
  icon: { color: '#FF5050' },
  textWrap: { flex: 1, justifyContent: 'center', paddingRight: 30 },
  text: { fontSize: 17, lineHeight: 20, color: theme.iplayya.colors.black70 },
  buttonContainer: { paddingBottom: 20 },
  button: { fontSize: 17, fontWeight: '700' }
});
