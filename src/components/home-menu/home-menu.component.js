import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Itv from 'images/btn_itv.svg';
import Iradio from 'images/btn_iradio.svg';
import Iplay from 'images/btn_iplay.svg';
import Imusic from 'images/btn_imusic.svg';
import Imovie from 'images/btn_imovie.svg';

const HomeMenu = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <Pressable style={styles.menuitem}>
        <View style={styles.iconwrap}>
          <Itv />
        </View>
        <Text style={styles.label}>iTV</Text>
      </Pressable>
      <Pressable style={styles.menuitem}>
        <View style={styles.iconwrap}>
          <Imovie />
        </View>
        <Text style={styles.label}>iMovie</Text>
      </Pressable>
      <Pressable style={styles.menuitem}>
        <View style={styles.iconwrap}>
          <Iplay />
        </View>
        <Text style={styles.label}>iPlay</Text>
      </Pressable>
      <Pressable style={styles.menuitem}>
        <View style={styles.iconwrap}>
          <Iradio />
        </View>
        <Text style={styles.label}>iRadio</Text>
      </Pressable>
      <Pressable style={styles.menuitem}>
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
