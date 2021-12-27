import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
// import Icon from 'components/icon/icon.component';
import RadioButton from 'components/radio-button/radio-button.component';
import FavoriteButton from 'components/button-favorite/favorite-button.component';
import { createFontFormat } from 'utils';
import moment from 'moment';
import { compose } from 'redux';
import { useMutation } from '@apollo/client';
import { ADD_TO_FAVORITES } from 'graphql/isports.graphql';
import SnackBar from 'components/snackbar/snackbar.component';

const Content = ({ theme, item, selected, activateCheckboxes }) => {
  const { number, title, epgtitle, time, time_to } = item;

  const [showError, setShowError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [addToFavorites, { data, loading, error }] = useMutation(ADD_TO_FAVORITES, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          favoriteIsports: (previous = [], { toReference }) => {
            return [...previous, toReference(data.addIsportToFavorites)];
          },
          isports: (previous = [], { toReference }) => {
            return [...previous, toReference(data.addIsportToFavorites)];
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

  // const renderCatchUpIndicator = () => {
  //   if (typeof isCatchUpAvailable === 'undefined') return;

  //   if (isCatchUpAvailable) return <Icon name="history" color="#13BD38" />;
  // };

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

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')} `;
  };

  const renderEpgIndicator = () => {
    if (!epgtitle) return;

    return (
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          color: theme.iplayya.colors.white50
        }}
      >
        | EPG
      </Text>
    );
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
        <FavoriteButton item={item} pressAction={() => handleFavoritePress()} />
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
          numberOfLines={1}
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
          {renderEpgIndicator()}
        </Text>
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

const enhance = compose(withTheme);

export default enhance(React.memo(Content));
