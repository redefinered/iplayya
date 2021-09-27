import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, FlatList, Dimensions } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { createFontFormat } from 'utils';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectRadioStations,
  selectAddedToFavorites,
  selectPaginator,
  selectPaginatorInfo
} from 'modules/ducks/iradio/iradio.selectors';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import ContentWrap from 'components/content-wrap.component';

const RadioStationsTab = ({
  theme,
  getRadioStationsAction,
  radioStations,
  addToFavoritesAction,
  addedToFavorites,
  paginator,
  paginatorInfo,
  handleSelectItem,
  getFavoritesAction
}) => {
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [favorited, setFavorited] = React.useState('');
  const [radioStationsData, setRadioStationsData] = React.useState([]);
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  React.useEffect(() => {
    getRadioStationsAction(paginator);
  }, []);

  // React.useEffect(() => {
  //   if (radioStations.length === 10) {
  //     getRadioStationsAction(paginator);
  //   } else {
  //     return;
  //   }
  // }, []);

  // setup radio data
  React.useEffect(() => {
    if (radioStations.length) {
      let data = radioStations.map(({ id, name, is_favorite, number, ...rest }) => ({
        id,
        name,
        is_favorite,
        number,
        ...rest
      }));
      setRadioStationsData(data);
    } else {
      setRadioStationsData([]);
    }
  }, [radioStations]);

  const handleEndReached = () => {
    console.log('ditoako');
    if (!onEndReachedCalledDuringMomentum) {
      getRadioStationsAction(paginator);
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  const handleAddToFavorites = (radioId) => {
    let radio = radioStations.find(({ id }) => id === radioId);

    // if radio is not found stop
    if (typeof radio === 'undefined') return;

    const { is_favorite } = radio;

    if (is_favorite) return;

    let name = radioStations.find(({ id }) => id === radioId).name;
    setFavorited(name);

    addToFavoritesAction(parseInt(radioId));
  };

  React.useEffect(() => {
    if (addedToFavorites) {
      setShowSnackBar(true);
      getFavoritesAction(paginatorInfo);
      getRadioStationsAction({ limit: 10, pageNumber: 1, orderBy: 'number', order: 'asc' });
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

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: { id, name, is_favorite, number, ...rest } }) => {
    return (
      <Pressable
        onPress={() => handleSelectItem({ id, name, is_favorite, ...rest })}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent'
          }
        ]}
      >
        <ContentWrap
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
            // padding: theme.spacing(2)
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Text numberOfLines={1} style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
              {number}
            </Text>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
                {name}
              </Text>
            </View>
          </View>
          <View>
            <Pressable
              onPress={() => handleAddToFavorites(id, name)}
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
                style={{
                  color: is_favorite ? theme.iplayya.colors.vibrantpussy : 'white'
                }}
              />
            </Pressable>
          </View>
        </ContentWrap>
      </Pressable>
    );
  };

  // return radioStations.map(({ id, name, is_favorite, number, ...rest }) => (
  //   <React.Fragment key={id}>
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={radioStationsData}
        keyExtractor={(item) => item.id}
        onEndReached={() => handleEndReached()}
        snapToInterval={Dimensions.get('window').height}
        onEndReachedThreshold={0.6}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        renderItem={renderItem}
      />
      <SnackBar
        visible={showSnackBar}
        message={`${favorited} is added to your favorites list`}
        iconName="heart-solid"
        iconColor="#FF5050"
      />
    </View>
  );
};

RadioStationsTab.propTypes = {
  theme: PropTypes.object,
  getRadioStationsAction: PropTypes.func,
  radioStations: PropTypes.array,
  addedToFavorites: PropTypes.bool,
  addToFavoritesAction: PropTypes.func,
  getFavoritesAction: PropTypes.func,
  handleSelectItem: PropTypes.func,
  paginator: PropTypes.object,
  paginatorInfo: PropTypes.object
};

const actions = {
  getRadioStationsAction: Creators.get,
  getFavoritesAction: Creators.getFavorites,
  addToFavoritesAction: Creators.addToFavorites
};

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations,
  addedToFavorites: selectAddedToFavorites,
  paginator: selectPaginator,
  paginatorInfo: selectPaginatorInfo
});

export default compose(connect(mapStateToProps, actions), withTheme)(RadioStationsTab);
