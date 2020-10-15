import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  contentWrap: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  content: { flexDirection: 'row', paddingTop: 40 },
  iconWrap: { paddingLeft: 44, paddingRight: 12 },
  icon: { color: '#FF5050' },
  textWrap: { flex: 1, justifyContent: 'center', paddingRight: 30 },
  text: { fontSize: 17, lineHeight: 20, color: 'rgba(13, 17, 29, 0.7)' },
  buttonContainer: { paddingBottom: 20 },
  button: { fontSize: 17, fontWeight: '700' }
});
