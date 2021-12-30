/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, Image, TextInput as FormInput, FlatList } from 'react-native';
import { Text, withTheme, TextInput as RNPTextInput, ActivityIndicator } from 'react-native-paper';
import RadioButton from 'components/radio-button/radio-button.component';
import Icon from 'components/icon/icon.component';
import TextInput from 'components/text-input/text-input.component';
import ScreenContainer from 'components/screen-container.component';
import Spacer from 'components/spacer.component';
import ContentWrap from 'components/content-wrap.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { createStructuredSelector } from 'reselect';
import AlertModal from 'components/alert-modal/alert-modal.component';
import {
  selectError,
  selectFavorites,
  selectRemovedFromFavorites,
  selectFavoritesPaginator,
  selectIsSearching
} from 'modules/ducks/movies/movies.selectors';
import NoFavorites from 'assets/favorites-empty-screen.svg';
import { createFontFormat } from 'utils';
import withNotifRedirect from 'components/with-notif-redirect.component';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_MOVIES } from 'graphql/movies.graphql';

import uniqBy from 'lodash/uniqBy';

const ITEM_HEIGHT = 84;
const LIMIT = 10;

const ImovieFavoritesScreen = ({
  theme,
  navigation,
  // favorites,
  removedFromFavorites,
  resetRemovedAction,
  removeFromFavoritesAction,
  // getFavoritesAction,
  // favoritesPaginator,
  // resetFavoritesPaginatorAction,
  isSearching
}) => {
  const updated = React.useRef(false);
  const pageNumber = React.useRef(1);

  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [listData, setListData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [noResult, setNoResult] = React.useState(false);

  React.useEffect(() => {
    resetRemovedAction();
  });

  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = React.useState(
    true
  );

  const { loading, data, fetchMore } = useQuery(GET_FAVORITE_MOVIES, {
    variables: { input: { pageNumber: 1, limit: pageNumber.current * LIMIT } },
    pollInterval: 300
  });

  const handleEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      fetchMore({ variables: { input: { pageNumber: pageNumber.current + 1 } } }).then(
        ({ data: { favoriteVideos } }) => {
          setListData(uniqBy([...listData, ...favoriteVideos], 'id'));

          pageNumber.current = pageNumber.current + 1;
        }
      );

      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  // const loadMore = () => {
  //   fetchMore({
  //     variables: { input: { pageNumber: pageNumber.current + 1, limit: 2 } }
  //   }).then();
  // };

  React.useEffect(() => {
    if (data) setListData(uniqBy(data.favoriteVideos, 'id'));
  }, [data]);

  React.useEffect(() => {
    if (data) {
      if (!isSearching) {
        setListData(data.favoriteVideos);
        setNoResult(false);
      }
    }
  }, [data, isSearching]);

  React.useEffect(() => {
    if (!searchTerm.length) {
      if (data) setListData(data.favoriteVideos);
    }
    if (searchTerm) {
      const d = listData.filter(({ title }) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!d.length) return setNoResult(true);
      setNoResult(false);
      return setListData(d);
    }
    if (data) setListData(data.favoriteVideos);
  }, [data, searchTerm]);

  React.useEffect(() => {
    if (!searchTerm.length) {
      setNoResult(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (listData) {
      setActivateCheckboxes(false);
    }
  }, [listData]);

  React.useEffect(() => {
    if (removedFromFavorites) {
      // resetFavoritesPaginatorAction();

      updated.current = true;
      setActivateCheckboxes(false);

      if (data) setListData(uniqBy(data.favoriteVideos, 'id'));

      // getFavoritesAction(Object.assign(favoritesPaginator, { pageNumber: 1 }));
    } else {
      updated.current = false;
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
      let collection = listData.map(({ id }) => {
        return id;
      });
      setSelectedItems(collection);
    } else {
      setSelectedItems([]);
    }
  }, [selectAll]);

  const handleSelectAll = () => {
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

  const handleChange = (term) => {
    setSearchTerm(term);
  };

  const renderSearchBar = () => {
    if (isSearching)
      return (
        <ContentWrap>
          <TextInput
            multiline={false}
            name="search"
            handleChangeText={(term) => handleChange(term)}
            returnKeyType="search"
            autoFocus
            autoCapitalize="none"
            clearButtonMode="while-editing"
            autoCompleteType="email"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
            placeholder="Search a favorite"
            render={(props) => (
              <FormInput
                {...props}
                style={{
                  flex: 1,
                  marginLeft: 40,
                  fontSize: 16,
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              />
            )}
            left={
              <RNPTextInput.Icon
                name={() => (
                  <Icon name="search" size={theme.iconSize(4)} style={{ marginRight: 5 }} />
                )}
              />
            }
          />
        </ContentWrap>
      );
  };

  const renderLoader = () => {
    if (loading) {
      return (
        <View style={{ height: ITEM_HEIGHT - theme.spacing(3) }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  const renderMain = ({
    item: { id, title, year, time, rating_mpaa, age_rating, category, thumbnail }
  }) => {
    let uri = thumbnail;
    return (
      <Pressable
        underlayColor={theme.iplayya.colors.black80}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent'
          }
        ]}
        onLongPress={() => handleLongPress(id)}
        onPress={() => handleSelectItem(id)}
      >
        <ContentWrap>
          <View style={{ position: 'relative', height: 96, paddingLeft: 75, marginBottom: 20 }}>
            {thumbnail.length ? (
              <Image
                style={{
                  width: 65,
                  height: 96,
                  borderRadius: 8,
                  position: 'absolute',
                  top: 10,
                  left: 4
                }}
                source={{ uri }}
              />
            ) : (
              <View
                style={{
                  width: 65,
                  height: 96,
                  borderRadius: 8,
                  backgroundColor: theme.iplayya.colors.white10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 10,
                  left: 4
                }}
              >
                <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View style={{ height: 96, justifyContent: 'center', flexShrink: 1 }}>
                <Text
                  numberOfLines={1}
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
          </View>
        </ContentWrap>
      </Pressable>
    );
  };

  const renderContent = () => {
    if (noResult)
      return (
        <ContentWrap style={{ marginTop: theme.spacing(3) }}>
          <Text>NO RESULTS FOUND</Text>
        </ContentWrap>
      );
    return (
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderMain}
        onEndReached={() => handleEndReached()}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      />
    );
  };

  if (listData.length) {
    return (
      <View style={{ marginTop: theme.spacing(3) }}>
        {activateCheckboxes && (
          <ContentWrap>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10
              }}
            >
              <Pressable
                onPress={() => setShowDeleteConfirmation(true)}
                underlayColor={theme.iplayya.colors.black80}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? theme.iplayya.colors.black80 : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5
                  }
                ]}
              >
                <Icon name="delete" size={theme.iconSize(3)} style={{ marginRight: 10 }} />
                <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
              </Pressable>
              <Pressable
                onPress={() => handleSelectAll()}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={{ marginRight: 10 }}>All</Text>
                <RadioButton selected={selectedItems.length === listData.length} />
              </Pressable>
            </View>

            <Spacer size={20} />
          </ContentWrap>
        )}

        {renderSearchBar()}
        {renderContent()}

        {renderLoader()}

        {/* <Button onPress={() => loadMore()}>load more</Button> */}
        {showDeleteConfirmation && (
          <AlertModal
            variant="confirmation"
            message={`Are you sure you want to delete ${
              selectedItems.length > 1 ? 'these' : 'this'
            } movie/s from your Favorites list?`}
            visible={showDeleteConfirmation}
            onCancel={handleHideConfirmDeleteModal}
            hideAction={handleHideConfirmDeleteModal}
            confirmText="Delete"
            confirmAction={handleConfirmDelete}
          />
        )}
      </View>
    );
  }

  return <EmptyState isFetching={loading} theme={theme} navigation={navigation} />;
};

const EmptyState = ({ isFetching, theme, navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 130
    }}
  >
    {isFetching && (
      <View style={{ height: ITEM_HEIGHT - theme.spacing(3) }}>
        <ActivityIndicator />
      </View>
    )}
    <NoFavorites />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No favorites yet</Text>
    <Spacer size={30} />
    <Pressable onPress={() => navigation.navigate('ImovieScreen')}>
      <Text style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(14, 19) }}>
        Heart a movie to add in your Favorites list.
      </Text>
    </Pressable>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ImovieFavoritesScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  favorites: selectFavorites,
  removedFromFavorites: selectRemovedFromFavorites,
  favoritesPaginator: selectFavoritesPaginator,
  isSearching: selectIsSearching
});

const actions = {
  resetRemovedAction: Creators.resetRemoved,
  removeFromFavoritesAction: Creators.removeFromFavorites,
  getFavoritesAction: Creators.getFavoriteMovies,
  resetFavoritesPaginatorAction: Creators.resetFavoritesPaginator
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
