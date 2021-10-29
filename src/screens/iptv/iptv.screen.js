/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { Pressable } from 'react-native';
import Icon from 'components/icon/icon.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import Button from 'components/button/button.component';
import IptvItem from './iptv-item.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import RadioButton from 'components/radio-button/radio-button.component';
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
  selectDeleted,
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
import { createFontFormat } from 'utils';
import uniq from 'lodash/uniq';
import theme from 'common/theme';

const IptvScreen = ({
  navigation,
  userIsFetching,
  error,
  userError,
  providers,
  created,
  deleted,
  setProviderAction,
  getProfileAction,
  createStartAction,
  deleteAction,
  deteteStartAction,
  route: { params },
  activeProviderId
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
  }, []);

  /// hide checkboxes when there is nothing selected
  React.useEffect(() => {
    if (!itemsForDelete.length) setShowCheckboxes(false);
  }, [itemsForDelete]);

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

  const handleDelete = (idsForDelete) => {
    if (!idsForDelete.length) return;

    deleteAction({ ids: idsForDelete });
    setActionSheetVisible(false);
  };

  const handleEdit = ({ selected }) => {
    const provider = providers.find((p) => p.id === selected);
    // console.log({ provider });
    navigation.navigate('EditIptvScreen', { provider });
    setActionSheetVisible(false);
  };

  const handleItemPress = ({ id }) => {
    // console.log({ id });
    if (showCheckboxes) {
      /// set 'deleted' indicator to null
      deteteStartAction();

      /// if selecting for delete
      if (itemsForDelete.includes(id)) {
        /// remove if already included
        setItemsForDelete(itemsForDelete.filter((iid) => iid !== id));
      } else {
        setItemsForDelete([id, ...itemsForDelete]);
      }
    } else {
      setActionSheetVisible(true);
      setSelected(id);
    }
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

    if (selected) {
      /// if 'selected' has a value
      // this happens if more button is tapped then canceled
      return handleDelete(uniq([selected, ...itemsForDelete]));
    }

    return handleDelete([...itemsForDelete]);
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

  const handleSelectAll = () => {
    if (itemsForDelete.length) {
      return setItemsForDelete([]);
    }

    return setItemsForDelete(providers.map(({ id }) => id));
  };

  const renderItem = ({ item }) => {
    return (
      <IptvItem
        id={item.id}
        showCheckboxes={showCheckboxes}
        setShowCheckboxes={setShowCheckboxes}
        onSelect={handleProviderSelect}
        active={item.id === activeProviderId}
        selected={itemsForDelete.includes(item.id)}
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

  const renderCheckboxesActiveHeader = () => {
    if (!showCheckboxes) return;

    return (
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
            <Icon name="delete" size={theme.iconSize(3)} style={{ marginRight: 10 }} />
            <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>Delete</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSelectAll()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ marginRight: 10 }}>All</Text>
            <RadioButton selected={itemsForDelete.length === providers.length} />
          </Pressable>
        </View>

        <Spacer size={30} />
      </ContentWrap>
    );
  };

  if (providers.length)
    return (
      <ContentWrap>
        <View style={{ paddingBottom: 120, paddingTop: 30 }}>
          {error && <Text style={{ marginBottom: 15 }}>{error}</Text>}
          {renderUserError()}
          {userIsFetching && <ActivityIndicator style={{ marginBottom: 15 }} />}

          {renderCheckboxesActiveHeader()}

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
