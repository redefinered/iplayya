import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import Content from './isports-list-item-channel-content.component';
import { createFontFormat } from 'utils';
import { compose } from 'redux';

const ItvListItemChanel = ({
  theme,
  item,
  full,
  selected,
  handleItemPress,
  handleLongPress,
  activateCheckboxes,
  onEpgButtonPressed
}) => {
  const ITEM_HEIGHT = 60 + theme.spacing(1) * 2;

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
            theme={theme}
            item={item}
            selected={selected}
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
          <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{item.title}</Text>
        </View>
      </Pressable>
    </ContentWrap>
  );
};

// eslint-disable-next-line react/prop-types

ItvListItemChanel.propTypes = {
  theme: PropTypes.object,
  item: PropTypes.object,
  full: PropTypes.bool,
  showepg: PropTypes.bool,
  showFavoriteButton: PropTypes.bool,
  handleItemPress: PropTypes.func,
  handleLongPress: PropTypes.func,
  selected: PropTypes.bool,
  activateCheckboxes: PropTypes.bool,
  onEpgButtonPressed: PropTypes.func
};

const enhance = compose(withTheme);

export default enhance(React.memo(ItvListItemChanel));
