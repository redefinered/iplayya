import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  name: { fontSize: 14, fontWeight: 'bold', lineHeight: 19, marginBottom: 3 },
  username: { fontSize: 12, lineHeight: 16 },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: { flex: 1 }
});
