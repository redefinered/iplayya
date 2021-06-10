import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import ContentWrap from 'components/content-wrap.component';
import { urlEncodeTitle, createFontFormat } from 'utils';
import Spacer from 'components/spacer.component';
import moment from 'moment';

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
  ...contentProps
}) => {
  const handleItemPress = () => {
    // const { epgtitle, time, time_to } = contentProps;
    // if (!epgtitle || !time || !time_to) return;

    onSelect(id);
  };

  if (full)
    return (
      <ContentWrap>
        <Pressable
          onLongPress={() => handleLongPress(id)}
          onPress={handleItemPress}
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
        onPress={handleItemPress}
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
          <Icon name="heart-solid" size={24} style={{ color: 'red' }} />
        </Pressable>
      </Pressable>
      <Spacer size={spacer} />
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({
  id,
  number,
  title,
  epgtitle,
  time,
  time_to,
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

  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
          Program title unavailable
        </Text>
      );

    return (
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {epgtitle}
      </Text>
    );
  };

  const getSchedule = (time, time_to) => {
    if (!time || !time_to) return;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
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
        <Text
          style={{ ...createFontFormat(12, 16), marginBottom: 5 }}
        >{`${number}: ${title}`}</Text>
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

      {renderEpgtitle()}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
            {getSchedule(time, time_to)}
          </Text>
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
  number: PropTypes.string,
  time: PropTypes.string,
  time_to: PropTypes.string,
  chanel: PropTypes.string,
  id: PropTypes.any,
  title: PropTypes.string,
  epgtitle: PropTypes.string,
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
