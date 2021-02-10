import React from 'react';
import PropTypes from 'prop-types';
import { Text, useTheme } from 'react-native-paper';
import { Pressable, StyleSheet, Image, View } from 'react-native';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import { createFontFormat } from 'utils';

const ItemPreview = ({ id, title, chanel, date, thumbnail, onSelect, variant }) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [isNotificationActive, setIsNotificationActive] = React.useState(true);
  if (variant === 'image')
    return (
      <Pressable onPress={() => onSelect(id)} key={id} style={{ marginRight: 10 }}>
        <Image style={{ width: 336, height: 190, borderRadius: 8 }} source={{ url }} />
      </Pressable>
    );
  return (
    <Pressable onPress={() => onSelect(id)} key={id} style={{ marginRight: 10 }}>
      <Image style={{ width: 240, height: 133, borderRadius: 8 }} source={{ url: thumbnail }} />
      <Spacer size={15} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: 15
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <Pressable>
          <Icon
            name="notifications"
            size={24}
            color={isNotificationActive ? theme.iplayya.colors.vibrantpussy : 'white'}
          />
        </Pressable>
      </View>
      {/* <Text style={styles.chanelName}>{chanel}</Text> */}
      {/* <Text style={styles.date}>{date}</Text> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    ...createFontFormat(12, 16),
    marginBottom: 4
  },
  chanelName: {
    ...createFontFormat(14, 19),
    marginBottom: 4,
    fontWeight: 'bold'
  },
  date: {
    ...createFontFormat(12, 16),
    marginBottom: 4
  }
});

ItemPreview.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  chanel: PropTypes.string,
  date: PropTypes.string,
  thumbnail: PropTypes.string,
  onSelect: PropTypes.func,
  variant: PropTypes.string
};

export default ItemPreview;
