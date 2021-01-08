import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import { urlEncodeTitle, createFontFormat } from 'utils';
import Spacer from 'components/spacer.component';

const spacer = 20;

const ListItemChanel = ({
  id,
  onSelect,
  onRightActionPress,
  isFavorite,
  full,
  ...contentProps
}) => {
  const theme = useTheme();

  if (full)
    return (
      <ContentWrap>
        <Pressable
          onPress={() => onSelect(id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}
        >
          <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
              source={{
                url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(
                  contentProps.title
                )}`
              }}
            />
            <Content
              {...contentProps}
              onRightActionPress={onRightActionPress}
              isFavorite={isFavorite}
            />
          </View>
        </Pressable>
        <Spacer size={spacer} />
      </ContentWrap>
    );

  return (
    <ContentWrap>
      <Pressable
        onPress={() => onSelect(id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            source={{
              url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(contentProps.title)}`
            }}
          />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
            {contentProps.title}
          </Text>
        </View>
        <Pressable onPress={() => onRightActionPress(contentProps.title)}>
          <Icon
            name="heart-solid"
            size={24}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </Pressable>
      <Spacer size={spacer} />
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({ title, chanel, time, onRightActionPress, isFavorite }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{title}</Text>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon
            name="heart-solid"
            size={24}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </View>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {chanel}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>{time}</Text>
          <Icon name="history" color="#13BD38" />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.iplayya.colors.white50
          }}
        >
          EPG
        </Text>
      </View>
    </View>
  );
};

ListItemChanel.propTypes = {
  id: PropTypes.any,
  title: PropTypes.string,
  isFavorite: PropTypes.bool,
  full: PropTypes.bool,
  onSelect: PropTypes.func,
  onRightActionPress: PropTypes.func
};

export default ListItemChanel;
