import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';

const DownloadItem = ({
  id,
  theme,
  title,
  year,
  time,
  rating_mpaa,
  age_rating,
  category,
  handleSelectItem,

  // url is the thumbnail url
  url
}) => {
  return (
    <ContentWrap>
      {/* <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: theme.iplayya.colors.vibrantpussy
        }}
      /> */}
      <Pressable
        style={{ position: 'relative', height: 96, paddingLeft: 75, marginBottom: 20 }}
        // onLongPress={() => handleLongPress(id)}
        onPress={() => handleSelectItem(id)}
      >
        <Image
          style={{
            width: 65,
            height: 96,
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          source={{ url }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View style={{ height: 96, justifyContent: 'center' }}>
            <Text
              style={{
                fontWeight: '700',
                ...createFontFormat(16, 22),
                marginBottom: 5
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                ...createFontFormat(12, 16),
                color: theme.iplayya.colors.white50,
                marginBottom: 5
              }}
            >{`${year}, ${Math.floor(time / 60)}h ${time % 60}m`}</Text>
            <Text
              style={{
                ...createFontFormat(12, 16),
                color: theme.iplayya.colors.white50,
                marginBottom: 5
              }}
            >{`${rating_mpaa}-${age_rating}, ${category}`}</Text>
          </View>
          {/* {activateCheckboxes && (
                      <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                    )} */}
        </View>
      </Pressable>
    </ContentWrap>
  );
};

DownloadItem.propTypes = {
  id: PropTypes.string,
  theme: PropTypes.object,
  handleSelectItem: PropTypes.func,
  title: PropTypes.string,
  year: PropTypes.string,
  time: PropTypes.string,
  rating_mpaa: PropTypes.string,
  age_rating: PropTypes.string,
  category: PropTypes.string,
  url: PropTypes.string
};

export default withTheme(DownloadItem);
