/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, Image, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import RadioButton from 'components/radio-button/radio-button.component';
import Icon from 'components/icon/icon.component';
import Spacer from 'components/spacer.component';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
// import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { createStructuredSelector } from 'reselect';
import AlertModal from 'components/alert-modal/alert-modal.component';
import {
  selectError,
  selectIsFetching,
  selectFavorites,
  selectRemovedFromFavorites
} from 'modules/ducks/movies/movies.selectors';
import NoFavorites from 'assets/favorite-movies-empty-state.svg';
import { createFontFormat } from 'utils';

const ImovieFavoritesScreen = ({
  theme,
  navigation,
  favorites,
  removedFromFavorites,
  removeFromFavoritesAction,
  getFavoritesAction
}) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    getFavoritesAction();
  }, []);

  React.useEffect(() => {
    if (removedFromFavorites) {
      getFavoritesAction();
      setSelectedItems([]);
    }
  }, [removedFromFavorites]);

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

  // hide checkboxes when there is no selected item
  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setActivateCheckboxes(false);
    }
  }, [selectedItems]);

  React.useEffect(() => {
    if (selectAll) {
      let collection = favorites.map(({ id }) => {
        return id;
      });
      setSelectedItems(collection);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  const handleSelectAll = () => {
    console.log('test');
    setSellectAll(!selectAll);
  };

  // console.log({ selectAll });

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  // remove items form favorites
  const handleRemoveItems = () => {
    if (selectedItems.length) {
      let deleteItems = selectedItems.map((id) => parseInt(id));
      removeFromFavoritesAction(deleteItems);
    }
  };

  console.log({ selectedItems });

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    // do delete action here
    // console.log('delete action');
    // setShowDeleteConfirmation(false);
    setShowDeleteConfirmation(false);
    handleRemoveItems();
  };

  const renderMain = () => {
    if (favorites.length) {
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
                <Pressable
                  onPress={() => setShowDeleteConfirmation(true)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Icon name="delete" size={24} style={{ marginRight: 10 }} />
                  <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
                </Pressable>
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
          {favorites.map(
            ({ id, title, year, time, rating_mpaa, age_rating, category, thumbnail }) => {
              let url = thumbnail ? thumbnail : 'http://via.placeholder.com/65x96.png';
              return (
                <ContentWrap key={id}>
                  <Pressable
                    style={{ position: 'relative', height: 96, paddingLeft: 75, marginBottom: 20 }}
                    onLongPress={() => handleLongPress(id)}
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
                      {activateCheckboxes && (
                        <RadioButton selected={selectedItems.findIndex((i) => i === id) >= 0} />
                      )}
                    </View>
                  </Pressable>
                </ContentWrap>
              );
            }
          )}
          {/* <Spacer size={100} /> */}
          {showDeleteConfirmation && (
            <AlertModal
              variant="danger"
              message={`Are you sure you want to delete ${
                selectedItems.length > 1 ? 'these' : 'this'
              } channel in your download list?`}
              visible={showDeleteConfirmation}
              onCancel={handleHideConfirmDeleteModal}
              hideAction={handleHideConfirmDeleteModal}
              confirmText="Delete"
              confirmAction={handleConfirmDelete}
            />
          )}
        </ScrollView>
      );
    }
    return <EmptyState theme={theme} navigation={navigation} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderMain()}
      {/* <ImovieBottomTabs navigation={navigation} route={route} /> */}
    </View>
  );
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
    <NoFavorites />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No favorites yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Heart a movie to add to your favorites list.
      </Text>
    </Pressable>
  </View>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  favorites: selectFavorites,
  removedFromFavorites: selectRemovedFromFavorites
});

const actions = {
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavoriteMovies
};

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
);

export default enhance(ImovieFavoritesScreen);
