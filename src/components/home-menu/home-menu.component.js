/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Itv from 'assets/btn_itv.svg';
import Iradio from 'assets/btn_iradio.svg';
import Iplay from 'assets/btn_iplay.svg';
import Imusic from 'assets/btn_imusic.svg';
import Imovie from 'assets/btn_imovie.svg';
import Isports from 'assets/btn_isports.svg';

const HomeMenu = ({ navigation }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('ItvScreen')}>
        <View style={styles.iconwrap}>
          <Itv />
        </View>
        <Text style={styles.label}>iTV</Text>
      </Pressable>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('ImovieScreen')}>
        <View style={styles.iconwrap}>
          <Imovie />
        </View>
        <Text style={styles.label}>iMovie</Text>
      </Pressable>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('IsportsScreen')}>
        <View style={styles.iconwrap}>
          <Isports />
        </View>
        <Text style={styles.label}>iSports</Text>
      </Pressable>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('IplayScreen')}>
        <View style={styles.iconwrap}>
          <Iplay />
        </View>
        <Text style={styles.label}>iPlay</Text>
      </Pressable>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('IradioScreen')}>
        <View style={styles.iconwrap}>
          <Iradio />
        </View>
        <Text style={styles.label}>iRadio</Text>
      </Pressable>
      <Pressable style={styles.menuitem} onPress={() => navigation.replace('ImusicScreen')}>
        <View style={styles.iconwrap}>
          <Imusic />
        </View>
        <Text style={styles.label}>iMusic</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuitem: { width: '33.33%', alignItems: 'center', marginBottom: 30 },
  iconwrap: { borderRadius: 28, overflow: 'hidden' },
  label: { marginTop: 10 }
});

export default HomeMenu;
