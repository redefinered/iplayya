/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import NoDownloads from 'assets/downloads-empty.svg';
import AlertModal from 'components/alert-modal/alert-modal.component';
import RadioButton from 'components/radio-button/radio-button.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
// import withLoader from 'components/with-loader.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import ListItemItvDownloads from 'components/list-item-itv-downloads/list-item-itv-downloads.component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectPaginatorInfo } from 'modules/ducks/itv/itv.selectors';
import { selectFavorites, selectError, selectIsFetching } from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';
import { Creators } from 'modules/ducks/itv/itv.actions';
import dummydata from './itv-downloads.dummy.json';

const ItvDownloadsScreen = ({ theme, navigation, removeFromFavoritesAction }) => {
  const [activateCheckboxes, setActivateCheckboxes] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectAll, setSellectAll] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(true);

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
      let collection = dummydata.map(({ id }) => {
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

  const handleLongPress = (id) => {
    setSelectedItems([id]);
    setActivateCheckboxes(true);
  };

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    // do delete action here
    console.log('delete action');
    setShowDeleteConfirmation(false);
  };

  if (dummydata.length)
    return (
      <ScrollView>
        {activateCheckboxes && (
          <ContentWrap style={{ marginTop: 10 }}>
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
                <RadioButton selected={selectedItems.length === dummydata.length} />
              </Pressable>
            </View>

            <Spacer size={30} />
          </ContentWrap>
        )}

        <View style={{ marginTop: 20 }}>
          {dummydata.map(({ id, ...otherProps }) => {
            return (
              <ListItemItvDownloads
                key={id}
                id={id}
                handleLongPress={handleLongPress}
                handleSelectItem={handleSelectItem}
                activateCheckboxes={activateCheckboxes}
                {...otherProps}
                selected={selectedItems.findIndex((i) => i === id) >= 0}
              />
            );
          })}
        </View>

        {showDeleteConfirmation && (
          <AlertModal
            variant="danger"
            message="Are you sure you want to delete this channel in your download list?"
            visible={showDeleteConfirmation}
            onCancel={handleHideConfirmDeleteModal}
            hideAction={handleHideConfirmDeleteModal}
            confirmText="Delete"
            confirmAction={handleConfirmDelete}
          />
        )}
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

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
);

export default enhance(ItvDownloadsScreen);
