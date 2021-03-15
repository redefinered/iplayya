/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, useTheme } from 'react-native-paper';
import { Pressable, StyleSheet, Image, View } from 'react-native';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import { createFontFormat } from 'utils';

const ItemPreview = ({
  id,
  title,
  thumbnail,
  onSelect,
  variant,
  handleSubscribeToItem,
  isNotificationActive
}) => {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  // const [isNotificationActive, setIsNotificationActive] = React.useState(true);

  console.log({ thumbnail });
  if (variant === 'image')
    return (
      <Pressable onPress={() => onSelect(id)} key={id} style={{ marginRight: 10 }}>
        <Image style={{ width: 336, height: 190, borderRadius: 8 }} source={{ url: thumbnail }} />
      </Pressable>
    );
  return (
    <Pressable onPress={() => onSelect(id)} key={id} style={{ marginRight: 10 }}>
      <Image style={{ width: 240, height: 133, borderRadius: 8 }} source={thumbnail} />
      {/* <View style={{ width: 240, height: 133, borderRadius: 8, backgroundColor: 'black' }} /> */}
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
        <Pressable onPress={() => handleSubscribeToItem(id)}>
          <Icon
            name="notifications"
            size={24}
            color={isNotificationActive ? theme.iplayya.colors.vibrantpussy : 'white'}
          />
        </Pressable>
      </View>
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
  thumbnail: PropTypes.any,
  onSelect: PropTypes.func,
  variant: PropTypes.string,
  handleSubscribeToItem: PropTypes.func,
  isNotificationActive: PropTypes.bool
};

export default ItemPreview;
