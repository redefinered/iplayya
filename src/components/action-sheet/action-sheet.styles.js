import { StyleSheet } from 'react-native';
import theme from 'common/theme';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  contentWrap: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 15,
    padding: 15
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingVertical: 10
  },
  iconContainer: { flex: 2, alignItems: 'center' },
  textContainer: { flex: 10 },
  text: { lineHeight: 19, fontWeight: 'bold', color: theme.iplayya.colors.black70 },
  iconColor: { color: theme.iplayya.colors.black70 }
});
