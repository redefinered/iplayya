import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import FavoriteButton from 'components/button-favorite/favorite-button.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import moment from 'moment';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { useMutation } from '@apollo/client';
import { ADD_TO_FAVORITES } from 'graphql/itv.graphql';
import SnackBar from 'components/snackbar/snackbar.component';

const ListItemChanel = ({
  theme,
  item,
  full,
  selected,
  showepg,
  showFavoriteButton,
  handleItemPress,
  handleLongPress,
  activateCheckboxes,
  addToFavoritesAction,
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
            showepg={showepg}
            showFavoriteButton={showFavoriteButton}
            activateCheckboxes={activateCheckboxes}
            addToFavoritesAction={addToFavoritesAction}
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
const Content = ({
  theme,
  item,
  selected,
  showepg,
  showFavoriteButton,
  isCatchUpAvailable,
  onEpgButtonPressed,
  activateCheckboxes
}) => {
  const { id, number, title, epgtitle, time, time_to } = item;

  const [showError, setShowError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [addToFavorites, { data, loading, error }] = useMutation(ADD_TO_FAVORITES, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          favoriteIptvs: (previous, { toReference }) => {
            return [...previous, toReference(data.addIptvToFavorites)];
          },
          iptvs: (previous, { toReference }) => {
            console.log({ previous });
            return [...previous, toReference(data.addIptvToFavorites)];
          }
        }
      });
    }
  });

  React.useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  React.useEffect(() => {
    if (showSuccess) hideSuccessModal();
  }, [showSuccess]);

  React.useEffect(() => {
    if (showError) hideErrorModal();
  }, [showError]);

  const hideSuccessModal = () => {
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const hideErrorModal = () => {
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const handleFavoritePress = () => {
    /// immediately show success
    setShowSuccess(true);

    addToFavorites({ variables: { input: { videoId: item.id } } });
  };

  const renderCatchUpIndicator = () => {
    if (typeof isCatchUpAvailable === 'undefined') return;

    if (isCatchUpAvailable) return <Icon name="history" color="#13BD38" />;
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

  const renderRightComponent = () => {
    if (activateCheckboxes)
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RadioButton selected={selected} />
        </View>
      );

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {showFavoriteButton && (
          <FavoriteButton item={item} pressAction={() => handleFavoritePress()} />
        )}

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
    );
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

      {renderRightComponent()}

      <SnackBar
        visible={showError}
        message="Something went wrong. Please try again."
        iconName="alert"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />

      <SnackBar
        visible={showSuccess}
        message={`${title} is added to your Favorites list`}
        iconName="heart-solid"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

Content.propTypes = {
  theme: PropTypes.object,
  item: PropTypes.object,
  selected: PropTypes.bool,
  showepg: PropTypes.bool,
  showFavoriteButton: PropTypes.bool,
  handleFavoritePress: PropTypes.func,
  activateCheckboxes: PropTypes.bool,
  isCatchUpAvailable: PropTypes.bool,
  addToFavoritesAction: PropTypes.func,
  onEpgButtonPressed: PropTypes.func
};

Content.defaultProps = {
  showepg: true,
  showFavoriteButton: true
};

ListItemChanel.propTypes = {
  theme: PropTypes.object,
  item: PropTypes.object,
  full: PropTypes.bool,
  showepg: PropTypes.bool,
  showFavoriteButton: PropTypes.bool,
  handleItemPress: PropTypes.func,
  handleLongPress: PropTypes.func,
  selected: PropTypes.bool,
  addToFavoritesAction: PropTypes.func,
  activateCheckboxes: PropTypes.bool,
  onEpgButtonPressed: PropTypes.func
};

const actions = {
  addToFavoritesAction: Creators.addToFavorites
};

const enhance = compose(connect(null, actions), withTheme);

export default enhance(React.memo(ListItemChanel));
