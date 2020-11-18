import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  contentWrap: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden' },
  artwork: { backgroundColor: 'white' },
  content: { paddingHorizontal: 20, paddingVertical: 30 },
  headline: {
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 'bold',
    marginBottom: 10
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 14,
    lineHeight: 19
  },
  button: { width: '50%', alignSelf: 'center' }
});
