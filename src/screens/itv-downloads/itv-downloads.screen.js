/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import NoDownloads from 'assets/downloads-empty.svg';
import RadioButton from 'components/radio-button/radio-button.component';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectPaginatorInfo } from 'modules/ducks/itv/itv.selectors';
import { selectFavorites, selectError, selectIsFetching } from 'modules/ducks/itv/itv.selectors';
import { urlEncodeTitle, createFontFormat } from 'utils';
import { Creators } from 'modules/ducks/itv/itv.actions';

const ItvFavoritesScreen = ({ theme, navigation, favorites, removeFromFavoritesAction }) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);

  // setup channels data
  React.useEffect(() => {
    if (favorites.length) {
      let data = favorites.map(({ id, title }) => ({
        id,
        title,
        thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
      }));
      setListData(data);
    }
  }, [favorites]);

  const handleSelectItem = (item) => {
    if (activateCheckboxes) {
      const newItems = selectedItems;
      const index = selectedItems.findIndex((i) => i === item);
      if (index >= 0) {
        newItems.splice(index, 1);
        setSelectedItems([...newItems]);
      } else {
        setSelectedItems([item, ...selectedItems]);
      }
    } else {
      navigation.navigate('MovieDetailScreen', { videoId: item });
    }
  };

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  const handleSelectAll = () => {
    setSellectAll(!selectAll);
  };

  const handleRemoveItem = (videoIds) => {
    // required input propert is `videoId`
    removeFromFavoritesAction(videoIds);
  };

  if (listData.length)
    return (
      <ScrollView>
        {activateCheckboxes && (
          <ContentWrap>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="delete" size={24} style={{ marginRight: 10 }} />
                <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
              </View>
              <Pressable
                onPress={() => handleSelectAll()}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ marginRight: 10 }}>All</Text>
                <RadioButton selected={selectedItems.length === favorites.length} />
              </Pressable>
            </View>

            <Spacer size={30} />
          </ContentWrap>
        )}

        <View>
          <Pressable onPress={() => handleRemoveItem([4117])}>
            <Text>test delete</Text>
          </Pressable>
          {listData.map(({ id, ...itemProps }) => (
            <ListItemChanel
              key={id}
              id={id}
              handleLongPress={handleLongPress}
              onSelect={handleSelectItem}
              onRightActionPress={null}
              selected={selectedItems.findIndex((i) => i === id) >= 0}
              activateCheckboxes={activateCheckboxes}
              isFavorite={
                typeof favorites.find(({ id: fid }) => parseInt(fid) === id) !== 'undefined'
                  ? true
                  : false
              }
              {...itemProps}
              full
            />
          ))}
        </View>
      </ScrollView>
    );

  return <EmptyState theme={theme} navigation={navigation} />;
};

const EmptyState = ({ theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    <NoDownloads />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No downloads yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Your downloaded channels will appear here.
      </Text>
    </Pressable>
  </View>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  paginatorInfo: selectPaginatorInfo,
  favorites: selectFavorites
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites
};

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(ItvFavoritesScreen);
