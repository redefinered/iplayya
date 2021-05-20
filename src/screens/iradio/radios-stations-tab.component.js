import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, TouchableRipple, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { createFontFormat } from 'utils';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectRadioStations,
  selectAddedToFavorites,
  selectPaginatorInfo
} from 'modules/ducks/radios/radios.selectors';
import { Creators } from 'modules/ducks/radios/radios.actions';

const RadioStationsTab = ({
  theme,
  getRadioStationsAction,
  radioStations,
  addToFavoritesAction,
  addedToFavorites,
  paginatorInfo,
  handleSelectItem
}) => {
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [favorited, setFavorited] = React.useState('');

  React.useEffect(() => {
    getRadioStationsAction(paginatorInfo);
  }, []);

  // const [data, setData] = React.useState([]);

  // add dummy thumbnails to radio stations
  // React.useEffect(() => {
  //   if (radioStations.length) {
  //     let stationsWithThumbnails = radioStations.map((station) => {
  //       return {
  //         ...station,
  //         thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
  //           'Station Number One'
  //         )}`
  //       };
  //     });
  //     setData(stationsWithThumbnails);
  //   }
  // }, [radioStations]);

  const handleAddToFavorites = (id, title) => {
    console.log({ id, title });
    // add channel to favorites
    addToFavoritesAction(id);

    // set favorited title in state so it show on snackbar when add to favorites action is successful
    setFavorited(title);
  };

  React.useEffect(() => {
    if (addedToFavorites) {
      setShowSnackBar(true);
      getRadioStationsAction(paginatorInfo);
    }
  }, [addedToFavorites]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  return radioStations.map(({ id, name, is_favorite, ...rest }) => (
    <React.Fragment key={id}>
      <TouchableRipple onPress={() => handleSelectItem({ id, name, is_favorite, ...rest })}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(2)
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>{name}</Text>
          </View>
          <View>
            <Pressable onPress={() => handleAddToFavorites(id, name)}>
              <Icon
                name="heart-solid"
                size={24}
                style={{ color: is_favorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
              />
            </Pressable>
          </View>
        </View>
      </TouchableRipple>
      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
    </React.Fragment>
  ));
};

RadioStationsTab.propTypes = {
  theme: PropTypes.object,
  getRadioStationsAction: PropTypes.func,
  radioStations: PropTypes.array,
  addedToFavorites: PropTypes.bool
};

const actions = {
  getRadioStationsAction: Creators.get,
  addToFavoritesAction: Creators.addToFavorites
};

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations,
  addedToFavorites: selectAddedToFavorites,
  paginatorInfo: selectPaginatorInfo
});

export default compose(connect(mapStateToProps, actions), withTheme)(RadioStationsTab);
