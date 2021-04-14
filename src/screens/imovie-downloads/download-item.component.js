import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, Image, Dimensions } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import Icon from 'components/icon/icon.component';

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

  isDownloaded,

  // url is the thumbnail url
  imageUrl: uri,

  progress
}) => {
  // const [isDownloaded] = React.useState(false);
  const [paused] = React.useState(true);

  // console.log({ progress });

  const renderPauseButton = () => {
    if (paused)
      return (
        <Pressable style={{ marginLeft: theme.spacing(4) }}>
          <Icon name="circular-play" size={40} />
        </Pressable>
      );

    return (
      <Pressable style={{ marginLeft: theme.spacing(4) }}>
        <Icon name="circular-pause" size={40} />
      </Pressable>
    );
  };

  const renderProgress = () => {
    if (isDownloaded) return;
    if (!progress) return;

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: Dimensions.get('window').width,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: theme.spacing(4),
          flexDirection: 'row'
        }}
      >
        {/* <Pressable style={{ marginLeft: theme.spacing(4) }}>
        <Icon name="redo" size={40} />
      </Pressable> */}
        {renderPauseButton()}
        <Pressable style={{ marginLeft: theme.spacing(4) }}>
          <Icon name="close" size={40} />
        </Pressable>
        <View
          style={{
            backgroundColor: theme.iplayya.colors.white10,
            position: 'absolute',
            bottom: 0,
            left: 0
          }}
        >
          <View
            style={{
              width: (progress * Dimensions.get('window').width) / 100,
              height: 2,
              backgroundColor: theme.iplayya.colors.vibrantpussy
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ContentWrap style={{ position: 'relative', marginBottom: 20 }}>
      {/* <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: theme.iplayya.colors.vibrantpussy
        }}
      /> */}
      <Pressable
        style={{
          position: 'relative',
          height: 96,
          paddingLeft: 75,
          opacity: isDownloaded ? 1 : 0.5
        }}
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
          source={{ uri }}
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

      {renderProgress()}
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
  imageUrl: PropTypes.string,
  isDownloaded: PropTypes.bool,
  progress: PropTypes.number
};

export default withTheme(DownloadItem);
