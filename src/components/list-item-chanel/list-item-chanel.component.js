import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import ContentWrap from 'components/content-wrap.component';
import { urlEncodeTitle, createFontFormat } from 'utils';
import Spacer from 'components/spacer.component';

const spacer = 20;

const ListItemChanel = ({
  id,
  onSelect,
  onRightActionPress,
  is_favorite,
  full,
  selected,
  handleLongPress,
  activateCheckboxes,
  // eslint-disable-next-line react/prop-types
  archived_link,
  ...contentProps
}) => {
  const theme = useTheme();

  console.log({ thumbnailL: contentProps.thumbnail });

  if (full)
    return (
      <ContentWrap>
        <Pressable
          onLongPress={() => handleLongPress(id)}
          onPress={() => onSelect(id, archived_link)}
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
              // source={{
              //   url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(
              //     contentProps.title
              //   )}`
              // }}
              source={contentProps.thumbnail}
            />
            <Content
              {...contentProps}
              id={id}
              selected={selected}
              onRightActionPress={onRightActionPress}
              isFavorite={is_favorite}
              activateCheckboxes={activateCheckboxes}
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
            style={{ color: is_favorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </Pressable>
      <Spacer size={spacer} />
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({
  id,
  title,
  chanel,
  time,
  onRightActionPress,
  isFavorite,
  selected,
  activateCheckboxes
}) => {
  const theme = useTheme();

  const handleRightActionPress = () => {
    if (isFavorite) return;
    onRightActionPress(id);
  };

  const renderCheckbox = () => {
    if (!activateCheckboxes) return;
    return <RadioButton selected={selected} />;
  };
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
        {onRightActionPress ? (
          <Pressable onPress={() => handleRightActionPress()}>
            <Icon
              name="heart-solid"
              size={24}
              style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
            />
          </Pressable>
        ) : (
          renderCheckbox()
        )}
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

Content.propTypes = {
  time: PropTypes.string,
  chanel: PropTypes.string,
  id: PropTypes.any,
  title: PropTypes.string,
  isFavorite: PropTypes.bool,
  onRightActionPress: PropTypes.func,
  selected: PropTypes.bool,
  activateCheckboxes: PropTypes.bool
};

ListItemChanel.propTypes = {
  id: PropTypes.any,
  title: PropTypes.string,
  is_favorite: PropTypes.bool,
  full: PropTypes.bool,
  onSelect: PropTypes.func,
  onRightActionPress: PropTypes.func,
  selected: PropTypes.bool,
  handleLongPress: PropTypes.func,
  activateCheckboxes: PropTypes.bool
};

export default ListItemChanel;
