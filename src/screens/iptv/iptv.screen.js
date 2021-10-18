/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import IptvItem from './iptv-item.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as ProviderCreators } from 'modules/ducks/provider/provider.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProviders,
  selectCreated,
  // selectUpdated,
  selectDeleted,
  // selectSkipProviderAdd
  selectIsProviderSetupSkipped
} from 'modules/ducks/provider/provider.selectors';
import { selectOnboardinginfo } from 'modules/ducks/profile/profile.selectors';
import {
  selectIsFetching as selectUserIsFetching,
  selectError as selectUserError,
  selectActiveProviderId
} from 'modules/ducks/user/user.selectors';

import NoProvider from 'assets/no_provider.svg';

import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';
import { selectIsInitialSignIn } from 'modules/ducks/auth/auth.selectors';
import { FlatList } from 'react-native-gesture-handler';

const IptvScreen = ({
  navigation,
  userIsFetching,
  error,
  userError,
  providers,
  created,
  // updated,
  deleted,
  setProviderAction,
  getProfileAction,
  createStartAction,
  deleteAction,
  deteteStartAction,
  // isInitialSignIn,
  route: { params },
  activeProviderId
  // isProviderSetupSkipped
}) => {
  // const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [showCheckboxes, setShowCheckboxes] = React.useState(false);
  const [itemsForDelete, setItemsForDelete] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [showIptvGuide, setShowIptvGuide] = React.useState(false);
  const [showStepTwo, setShowStepTwo] = React.useState(false);
  const [showStepThree, setShowStepThree] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  React.useEffect(() => {
    createStartAction();
    // getProfileAction();
  }, []);

  React.useEffect(() => {
    if (params) {
      setShowIptvGuide(params.openIptvGuide);
    }
  }, [params]);

  React.useEffect(() => {
    /// fetch profile again when a provider is created
    if (created) getProfileAction();

    // if (updated) handleAddProviderSuccess();
    if (deleted) getProfileAction();

    // hide the snackbar in 3 sec
    // hideSnackBar();
  }, [deleted, created]);

  const handleVisibleWalkthrough = () => {
    setShowIptvGuide(false);
  };

  const handleNextWalkthrough = () => {
    setShowIptvGuide(false);
    setShowStepTwo(true);
  };

  const handleHideTwo = () => {
    setShowStepTwo(false);
  };

  const handleShowStepThree = () => {
    setShowStepTwo(false);
    setShowStepThree(true);
  };

  const handleHideStepThree = () => {
    setShowStepThree(false);
  };

  const handleProviderSelect = (id) => {
    setProviderAction(id);
  };

  // const hideSnackBar = () => {
  //   setTimeout(() => {
  //     setShowSuccessMessage(false);
  //   }, 3000);
  // };

  const handleDelete = ({ selected }) => {
    deteteStartAction();
    deleteAction({ id: selected });
    setActionSheetVisible(false);
  };

  const handleEdit = ({ selected }) => {
    const provider = providers.find((p) => p.id === selected);
    // console.log({ provider });
    navigation.navigate('EditIptvScreen', { provider });
    setActionSheetVisible(false);
  };

  const handleItemPress = ({ id }) => {
    setActionSheetVisible(true);
    setSelected(id);
  };
  // const data = providers.map((p) => ({ id, name, username }))

  const hideActionSheet = () => {
    setActionSheetVisible(false);
  };

  const handleHideConfirmDeleteModal = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
    handleDelete({ selected });
  };

  const handleShowDeleteConfirmation = () => {
    setActionSheetVisible(false);
    setShowDeleteConfirmation(true);
  };

  const actions = [
    { key: 'edit', icon: 'edit', title: 'Edit', onPress: handleEdit, data: { selected } },
    {
      key: 'delete',
      icon: 'delete',
      title: 'Delete',
      onPress: handleShowDeleteConfirmation,
      data: { selected }
    }
  ];

  const renderItem = ({ item }) => {
    return (
      <IptvItem
        id={item.id}
        showCheckboxes={showCheckboxes}
        setShowCheckboxes={setShowCheckboxes}
        onSelect={handleProviderSelect}
        active={item.id === activeProviderId}
        name={item.name || 'No Provider Name'}
        username={item.username}
        onActionPress={handleItemPress}
      />
    );
  };

  const renderUserError = () => {
    if (!userError) return;
    if (userError === 'Error: Provider not match') return;

    return <Text style={{ marginBottom: 15 }}>{userError}</Text>;
  };

  if (providers.length)
    return (
      <ContentWrap>
        <View style={{ paddingBottom: 120, paddingTop: 30 }}>
          {error && <Text style={{ marginBottom: 15 }}>{error}</Text>}
          {renderUserError()}
          {userIsFetching && <ActivityIndicator style={{ marginBottom: 15 }} />}
          <FlatList data={providers} renderItem={renderItem} />
          {/* <ScrollView>
            {providers.map(({ id, name, username }) => (
              <IptvItem
                key={id}
                id={id}
                onSelect={handleProviderSelect}
                name={name || 'No Provider Name'}
                username={username}
                onActionPress={handleItemPress}
              />
            ))}
          </ScrollView> */}
          <WalkThroughGuide
            visible={showIptvGuide}
            hideModal={handleVisibleWalkthrough}
            nextModal={handleNextWalkthrough}
            title="Add IPTV"
            content="Tap here to add your IPTV provider."
            skip="Skip"
            skipValue="- 1 of 3"
            next="Next"
            topWidth={20}
            rightWidth={20}
            leftWidth={20}
            heightValue={152}
            topPosValue={-2}
            trianglePosition="flex-end"
            rightPadding={15}
            containerPosition="flex-start"
            topPadding={110}
            rotateArrow="90deg"
          />
          <WalkThroughGuide
            visible={showStepTwo}
            hideModal={handleHideTwo}
            nextModal={handleShowStepThree}
            title="More options"
            content="Tap here for more IPTV options."
            skip="Skip"
            skipValue="- 2 of 3"
            next="Next"
            topWidth={20}
            rightWidth={20}
            leftWidth={20}
            heightValue={152}
            topPosValue={-2}
            trianglePosition="flex-end"
            rightPadding={25}
            containerPosition="flex-start"
            topPadding={210}
            rotateArrow="90deg"
          />
          <WalkThroughGuide
            visible={showStepThree}
            disabled={true}
            nextModal={handleHideStepThree}
            title="Back to Home"
            content="Tap here to go back to Home."
            skipValue="3 of 3"
            next="Got It"
            bottomWidth={25}
            rightWidth={15}
            leftWidth={15}
            heightValue={152}
            bottomPosValue={-45}
            trianglePosition="center"
            containerPosition="flex-end"
            bottomPadding={100}
            rotateArrow="178deg"
          />
        </View>
        {/* <SnackBar
          visible={showSuccessMessage}
          iconName="circular-check"
          iconColor="#13BD38"
          message="Changes saved successfully"
        /> */}
        <ActionSheet visible={actionSheetVisible} actions={actions} hideAction={hideActionSheet} />

        <AlertModal
          variant="danger"
          message="Are you sure you want to delete this provider?"
          visible={showDeleteConfirmation}
          onCancel={handleHideConfirmDeleteModal}
          hideAction={handleHideConfirmDeleteModal}
          confirmText="Delete"
          confirmAction={handleConfirmDelete}
        />
      </ContentWrap>
      // <Text>asd</Text>
    );

  return <NoProviders navigation={navigation} />;
};

const NoProviders = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 130,
      paddingTop: 30
    }}
  >
    <NoProvider />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No providers yet</Text>
    <Spacer />
    <Button onPress={() => navigation.navigate('AddIptvScreen')}>
      Tap to add your IPTV Provider
    </Button>
  </View>
);

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IptvScreen {...props} />
  </ScreenContainer>
);

IptvScreen.propTypes = {
  providers: PropTypes.array
};

const actions = {
  setProviderAction: UserCreators.setProvider,
  getProfileAction: ProfileCreators.get,
  deteteStartAction: ProviderCreators.deleteStart,
  deleteAction: ProviderCreators.delete,
  createStartAction: ProviderCreators.createStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  userError: selectUserError,
  userIsFetching: selectUserIsFetching,
  created: selectCreated,
  // updated: selectUpdated,
  deleted: selectDeleted,
  providers: selectProviders,
  // skipped: selectSkipProviderAdd,
  onboardinginfo: selectOnboardinginfo,
  isProviderSetupSkipped: selectIsProviderSetupSkipped,
  isInitialSignIn: selectIsInitialSignIn,
  activeProviderId: selectActiveProviderId
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
