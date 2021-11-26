import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import moment from 'moment';
import theme from 'common/theme';
// import { useNavigation } from '@react-navigation/native';

const ITEM_HEIGHT = 60 + theme.spacing(1) * 2;

const ListItemChanel = ({
  item,
  full,
  showepg,
  handleItemPress,
  handleLongPress,
  selected,
  onRightActionPress,
  activateCheckboxes,
  onEpgButtonPressed
}) => {
  const { id, title, is_favorite } = item;
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePress = () => {
    handleItemPress(item);
  };

  if (full)
    return (
      <Pressable
        onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
        onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
        onLongPress={() => handleLongPress(item.id)}
        underlayColor={theme.iplayya.colors.black80}
        onPress={handlePress}
        style={{
          flex: 1,
          flexDirection: 'row',
          height: ITEM_HEIGHT,
          paddingVertical: theme.spacing(1),
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent'
        }}
      >
        <View
          style={{
            flex: 11,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
            // paddingVertical: theme.spacing(1)
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              marginRight: 10,
              backgroundColor: theme.iplayya.colors.white10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
          </View>
          <Content
            {...item}
            id={id}
            showepg={showepg}
            selected={selected}
            onRightActionPress={onRightActionPress}
            isFavorite={is_favorite}
            activateCheckboxes={activateCheckboxes}
            isCatchUpAvailable={false} /// set to false for now since no catchup property in chanels yet
            onEpgButtonPressed={onEpgButtonPressed}
          />
        </View>
      </Pressable>
    );

  return (
    <ContentWrap>
      <Pressable
        onPress={handlePress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              marginRight: 10,
              backgroundColor: theme.iplayya.colors.white10,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
          </View>
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{title}</Text>
        </View>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon name="heart-solid" size={theme.iconSize(3)} style={{ color: 'red' }} />
        </Pressable>
      </Pressable>
      {/* <Spacer size={spacer} /> */}
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({
  id,
  // eslint-disable-next-line react/prop-types
  number,
  showepg,
  title,
  epgtitle,
  time,
  time_to,
  onRightActionPress,
  isFavorite,
  isCatchUpAvailable,
  onEpgButtonPressed
}) => {
  const theme = useTheme();

  const renderCatchUpIndicator = () => {
    if (typeof isCatchUpAvailable === 'undefined') return;

    if (isCatchUpAvailable) return <Icon name="history" color="#13BD38" />;
  };

  const handleRightActionPress = () => {
    if (isFavorite) return;
    onRightActionPress(id);
  };

  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
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

  const getSchedule = (time, time_to) => {
    if (!time || !time_to) return;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
      <View
        style={{
          justifyContent: 'center',
          marginBottom: 5,
          flex: 1
        }}
      >
        <Text
          style={{
            ...createFontFormat(12, 16),
            color: theme.iplayya.colors.white80,
            marginBottom: 5
          }}
        >{`${number}: ${title}`}</Text>

        {renderEpgtitle()}

        <Text
          style={{
            ...createFontFormat(12, 16),
            marginRight: 6,
            color: theme.iplayya.colors.white80
          }}
        >
          {getSchedule(time, time_to)}
        </Text>
        {renderCatchUpIndicator()}
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {onRightActionPress ? (
          <Pressable
            onPress={() => handleRightActionPress()}
            style={({ pressed }) => [
              {
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center'
              }
            ]}
          >
            <Icon
              name="heart-solid"
              size={theme.iconSize(3)}
              style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
            />
          </Pressable>
        ) : null}

        {showepg && (
          <Pressable
            underlayColor={theme.iplayya.colors.black80}
            onPress={() => onEpgButtonPressed(id)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center'
              }
            ]}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                color: theme.iplayya.colors.white50
              }}
            >
              EPG
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

Content.propTypes = {
  // number: PropTypes.string,
  showepg: PropTypes.bool,
  time: PropTypes.string,
  time_to: PropTypes.string,
  chanel: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  epgtitle: PropTypes.string,
  isFavorite: PropTypes.bool,
  onRightActionPress: PropTypes.func,
  selected: PropTypes.bool,
  activateCheckboxes: PropTypes.bool,
  isCatchUpAvailable: PropTypes.bool,
  onEpgButtonPressed: PropTypes.func
};

Content.defaultProps = {
  showepg: true
};

ListItemChanel.propTypes = {
  item: PropTypes.object,
  full: PropTypes.bool,
  showepg: PropTypes.bool,
  handleItemPress: PropTypes.func,
  handleLongPress: PropTypes.func,
  onRightActionPress: PropTypes.func,
  selected: PropTypes.bool,
  activateCheckboxes: PropTypes.bool,
  onEpgButtonPressed: PropTypes.func
};

export default React.memo(ListItemChanel);
