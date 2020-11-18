/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import IptvItem from 'components/iptv-item/iptv-item.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { View, ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as ProviderCreators } from 'modules/ducks/provider/provider.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProviders,
  selectCreated,
  selectDeleted
} from 'modules/ducks/provider/provider.selectors';

import NoProvider from 'images/no_provider.svg';
// import providersMock from './providers.mock';

const IptvScreen = ({
  navigation,
  error,
  providers,
  created,
  getProfileAction,
  deleteAction,
  deleted
}) => {
  console.log({ providers });
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    if (created) handleAddProviderSuccess();
    if (deleted) handleProviderDeleteSuccess();
    // hide the snackbar in 3 sec
    hideSnackBar();
  }, [created, deleted]);

  const handleAddProviderSuccess = () => {
    setShowSuccessMessage(true);
    getProfileAction();
  };

  const handleProviderDeleteSuccess = () => {
    getProfileAction();
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleDelete = ({ selected }) => {
    deleteAction({ id: selected });
  };

  const handleEdit = ({ selected }) => {
    console.log({ selected });
  };

  const handleItemPress = (id) => {
    setActionSheetVisible(true);
    setSelected(id);
  };
  // const data = providers.map((p) => ({ id, name, username }))

  const hideActionSheet = () => {
    setActionSheetVisible(false);
  };

  const actions = [
    { key: 'edit', icon: 'edit', title: 'Edit', onPress: handleEdit, data: { selected } },
    { key: 'delete', icon: 'delete', title: 'Delete', onPress: handleDelete, data: { selected } }
  ];

  if (providers.length)
    return (
      <ContentWrap>
        <View style={{ paddingBottom: 120 }}>
          {error && <Text>{error}</Text>}
          <ScrollView>
            {providers.map(({ id, name, username }) => (
              <IptvItem
                key={id}
                id={id}
                name={name || 'No Provider Name'}
                username={username}
                onActionPress={handleItemPress}
              />
            ))}
          </ScrollView>
        </View>
        <SnackBar visible={showSuccessMessage} message="Changes saved successfully" />
        <ActionSheet visible={actionSheetVisible} actions={actions} hideAction={hideActionSheet} />
      </ContentWrap>
    );

  return <NoProviders navigation={navigation} />;
};

const NoProviders = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 130
    }}
  >
    <NoProvider />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No providers yet</Text>
    <Spacer />
    <Button onPress={() => navigation.replace('AddIptvScreen')}>
      Tap to add you IPTV Provider
    </Button>
  </View>
);

IptvScreen.propTypes = {
  providers: PropTypes.array
};

const actions = {
  getProfileAction: ProfileCreators.get,
  deleteAction: ProviderCreators.delete
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  created: selectCreated,
  deleted: selectDeleted,
  providers: selectProviders
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(IptvScreen);
