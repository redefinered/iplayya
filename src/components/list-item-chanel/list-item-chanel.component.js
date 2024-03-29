import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
// import RadioButton from 'components/radio-button/radio-button.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import Spacer from 'components/spacer.component';
import moment from 'moment';
import theme from 'common/theme';
// import { useNavigation } from '@react-navigation/native';

const spacer = 20;

const ListItemChanel = ({
  id,
  onSelect,
  onRightActionPress,
  is_favorite,
  full,
  selected,
  activateCheckboxes,
  onEpgButtonPressed,
  ...contentProps
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleItemPress = () => {
    onSelect(id);
  };

  if (full)
    return (
      <Pressable
        onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
        onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
        underlayColor={theme.iplayya.colors.black80}
        onPress={handleItemPress}
        style={{
          flex: 1,
          flexDirection: 'row',
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
            paddingHorizontal: 10,
            paddingVertical: 2
            // padding: theme.spacing(2)
          }}
        >
          {/* <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            source={contentProps.thumbnail}
          /> */}
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
            {...contentProps}
            id={id}
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
        onPress={handleItemPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}
      >
        <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
          {/* <Image
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            source={{
              url: `http://via.placeholder.com/60x60.png?text=${urlEncodeTitle(contentProps.title)}`
            }}
          /> */}
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
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
            {contentProps.title}
          </Text>
        </View>
        <Pressable onPress={() => onRightActionPress(contentProps.title)}>
          <Icon name="heart-solid" size={theme.iconSize(3)} style={{ color: 'red' }} />
        </Pressable>
      </Pressable>
      <Spacer size={spacer} />
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types
const Content = ({
  id,
  // eslint-disable-next-line react/prop-types
  number,
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
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
      <View
        style={{
          justifyContent: 'center',
          marginBottom: 5
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

        <Pressable
          underlayColor={theme.iplayya.colors.black80}
          onPress={() => onEpgButtonPressed(id)}
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
      </View>
    </View>
  );
};

Content.propTypes = {
  // number: PropTypes.string,
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

ListItemChanel.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  is_favorite: PropTypes.bool,
  full: PropTypes.bool,
  onSelect: PropTypes.func,
  onRightActionPress: PropTypes.func,
  selected: PropTypes.bool,
  handleLongPress: PropTypes.func,
  activateCheckboxes: PropTypes.bool,
  onEpgButtonPressed: PropTypes.func
};

export default React.memo(ListItemChanel);
