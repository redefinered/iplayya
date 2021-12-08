import React from 'react';
import PropTypes from 'prop-types';
import { Text, useTheme } from 'react-native-paper';
import { Pressable, StyleSheet, Image, View } from 'react-native';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import { createFontFormat } from 'utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotifyButton from 'components/button-notify/button-notify.component';

const ItemPreview = ({ item, onSelect, variant }) => {
  const { id, title, epgtitle, thumbnail } = item;
  const theme = useTheme();

  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text
          numberOfLines={1}
          style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}
        >
          Program title unavailable
        </Text>
      );

    return (
      <Text
        numberOfLines={1}
        style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}
      >
        {epgtitle}
      </Text>
    );
  };

  if (variant === 'image')
    return (
      <Pressable onPress={() => onSelect(item)} key={id} style={{ marginRight: 10 }}>
        <Image style={{ width: 336, height: 190, borderRadius: 8 }} source={thumbnail} />
      </Pressable>
    );

  return (
    <View style={{ marginRight: 10, flex: 1 }}>
      <TouchableOpacity onPress={() => onSelect(item)}>
        <View
          style={{
            width: 240,
            height: 133,
            borderRadius: 8,
            backgroundColor: theme.iplayya.colors.white10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="iplayya" size={theme.iconSize(6)} color="white" />
        </View>
      </TouchableOpacity>
      <Spacer size={15} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // paddingRight: 15,
          width: 240
        }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            {renderEpgtitle()}
          </TouchableOpacity>
        </View>
        {/* <TouchableHighlight
          underlayColor="rgba(255,255,255,0.1)"
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('ItvProgramGuideScreen', { channelId: id })}
        >
          <Icon
            name="notifications"
            size={theme.iconSize(3)}
            color={isNotificationActive ? theme.iplayya.colors.vibrantpussy : 'white'}
          />
        </TouchableHighlight> */}
        <NotifyButton program={{ id, title, epgtitle, ...item }} />
      </View>
    </View>
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
  },
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

ItemPreview.propTypes = {
  item: PropTypes.object,
  onSelect: PropTypes.func,
  variant: PropTypes.string,
  handleSubscribeToItem: PropTypes.func,
  isNotificationActive: PropTypes.bool
};

export default React.memo(ItemPreview);
