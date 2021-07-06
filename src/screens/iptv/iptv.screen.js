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
  selectUpdated,
  selectDeleted,
  selectSkipProviderAdd
} from 'modules/ducks/provider/provider.selectors';
import {
  selectIsFetching as selectUserIsFetching,
  selectError as selectUserError
} from 'modules/ducks/user/user.selectors';

import NoProvider from 'assets/no_provider.svg';

import WalkThroughGuide from 'components/walkthrough-guide/walkthrough-guide.component';

const IptvScreen = ({
  navigation,
  userIsFetching,
  error,
  userError,
  providers,
  created,
  updated,
  deleted,
  setProviderAction,
  getProfileAction,
  createStartAction,
  deleteAction,
  deteteStartAction,
  skipped,
  route: { params }
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [actionSheetVisible, setActionSheetVisible] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [showIptvGuide, setShowIptvGuide] = React.useState(false);
  const [showStepTwo, setShowStepTwo] = React.useState(false);
  const [showStepThree, setShowStepThree] = React.useState(false);

  React.useEffect(() => {
    createStartAction();
  }, []);

  React.useEffect(() => {
    if (params) {
      setShowIptvGuide(params.openIptvGuide);
    }
  }, [params]);

  // redirect to add provider if there is 0 provider or if adding is not skipped
  React.useEffect(() => {
    if (providers.length === 0 && !skipped) navigation.replace('AddIptvScreen');
  }, [providers]);

  React.useEffect(() => {
    if (created) handleAddProviderSuccess();
    if (updated) handleAddProviderSuccess();
    if (deleted) handleProviderDeleteSuccess();
    // hide the snackbar in 3 sec
    hideSnackBar();
  }, [created, updated, deleted]);

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
        <View style={{ paddingBottom: 120, paddingTop: 30 }}>
          {error && <Text style={{ marginBottom: 15 }}>{error}</Text>}
          {userError && <Text style={{ marginBottom: 15 }}>{userError}</Text>}
          {userIsFetching && <ActivityIndicator style={{ marginBottom: 15 }} />}
          <ScrollView>
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
          </ScrollView>
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
        <SnackBar
          visible={showSuccessMessage}
          iconName="circular-check"
          iconColor="#13BD38"
          message="Changes saved successfully"
        />
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
      paddingBottom: 130,
      paddingTop: 30
    }}
  >
    <NoProvider />
    <Spacer />
    <Text style={{ fontSize: 24 }}>No providers yet</Text>
    <Spacer />
    <Button onPress={() => navigation.navigate('AddIptvScreen')}>
      Tap to add you IPTV Provider
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
  updated: selectUpdated,
  deleted: selectDeleted,
  providers: selectProviders,
  skipped: selectSkipProviderAdd
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
