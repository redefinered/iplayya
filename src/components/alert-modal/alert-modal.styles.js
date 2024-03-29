import { StyleSheet } from 'react-native';
import theme from 'common/theme';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  contentWrap: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  content: { flexDirection: 'row', paddingTop: 40 },
  iconWrap: { paddingLeft: 30, paddingRight: 12 },
  icon: { color: '#FF5050' },
  textWrap: { flex: 1, justifyContent: 'center', paddingRight: 10 },
  text: { fontSize: 17, lineHeight: 20, color: theme.iplayya.colors.black70 },
  buttonContainer: {
    paddingBottom: 20,
    paddingHorizontal: 40,
    flexDirection: 'row'
    // justifyContent: 'space-between'
  },
  button: { fontSize: 17, fontWeight: '700' }
});
