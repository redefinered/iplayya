import React from 'react';
import PropTypes from 'prop-types';
import RadioButton from 'components/radio-button/radio-button.component';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { createFontFormat } from 'utils';
import theme from 'common/theme';

const MediaItem = ({ index, onLongPress, onSelect, filesize, selected, visible, ...rest }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const renderRadioButton = () => {
    if (visible) return <RadioButton selected={selected} />;
  };
  return (
    <Pressable
      key={index}
      onLongPress={() => onLongPress(rest.id)}
      onPress={() => onSelect({ ...rest })}
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      style={{
        paddingHorizontal: theme.spacing(2),
        paddingVertical: theme.spacing(2),
        backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent'
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 5,
              ...createFontFormat(12, 16)
            }}
          >
            {rest.name}
          </Text>
          <Text style={{ ...createFontFormat(12, 16) }}>{`${filesize.toFixed(1)} mb`}</Text>
        </View>
        {renderRadioButton()}
      </View>
    </Pressable>
  );
};

MediaItem.propTypes = {
  index: PropTypes.number,
  onLongPress: PropTypes.func,
  onSelect: PropTypes.func,
  filesize: PropTypes.number,
  selected: PropTypes.bool,
  visible: PropTypes.bool
};

export default MediaItem;
