/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, withTheme, List, TouchableRipple } from 'react-native-paper';

import ScreenContainer from 'components/screen-container.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import withNotifRedirect from 'components/with-notif-redirect.component';

const styles = StyleSheet.create({
  textQuestion: {
    paddingHorizontal: 15,
    fontSize: 14,
    color: 'white'
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 16
  }
});

const NeedHelpScreen = ({ theme, enableSwipeAction, navigation }) => {
  React.useEffect(() => {
    enableSwipeAction(false);
  }, []);

  return (
    <ScrollView>
      <View style={{ paddingTop: 20 }}>
        <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => console.log('click')}>
          <View
            style={{
              padding: theme.spacing(2)
            }}
          >
            <Text style={styles.headerText}>Terms of Use</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple
          rippleColor="rgba(0,0,0,0.28)"
          onPress={() => navigation.navigate('WalkthroughScreen')}
        >
          <View
            style={{
              padding: theme.spacing(2)
            }}
          >
            <Text style={styles.headerText}>How to use iPlayya</Text>
          </View>
        </TouchableRipple>
        <View
          style={{
            padding: theme.spacing(2)
          }}
        >
          <Text style={styles.headerText}>Frequenlty Asked Questions</Text>
        </View>
        <View>
          <List.Accordion
            theme={{
              colors: {
                text: theme.iplayya.colors.vibrantpussy
              }
            }}
            style={{ ...styles.titleContainer }}
            titleStyle={{
              color: theme.iplayya.colors.vibrantpussy,
              fontSize: 14
            }}
            title="What is question number 1?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy, backgroundColor: 'red' } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 2?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 3?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 4?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 5?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 6?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 7?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 8?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 9?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
          <List.Accordion
            theme={{ colors: { text: theme.iplayya.colors.vibrantpussy } }}
            style={styles.titleContainer}
            titleStyle={{ color: theme.iplayya.colors.vibrantpussy, fontSize: 14 }}
            title="What is question number 10?"
          >
            <Text style={styles.textQuestion}>
              It is a question number that Zombie ipsum reversus ab viral inferno, nam rick grimes
              malum cerebro. De carne lumbering animata corpora quaeritis. Sumus brains morbo vel
              maleficia? De apocalypsigorger omero undead survivor dictum mauris. Hi mindless
              mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus
              comedat cerebella viventium. The voodoo sacerdos flesh eater, suscitat mortuos
              comedere carnem virus.
            </Text>
          </List.Accordion>
        </View>
      </View>
    </ScrollView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <NeedHelpScreen {...props} />
  </ScreenContainer>
);

const actions = {
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(null, actions), withTheme, withNotifRedirect);

export default enhance(Container);
