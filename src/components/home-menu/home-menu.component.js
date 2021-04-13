/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Itv from 'assets/btn_itv.svg';
import Iradio from 'assets/btn_iradio.svg';
import Iplay from 'assets/btn_iplay.svg';
import Imusic from 'assets/btn_imusic.svg';
import Imovie from 'assets/btn_imovie.svg';
import Isports from 'assets/btn_isports.svg';

// import RNFetchBlob from 'rn-fetch-blob';
// import RNFS from 'react-native-fs';

// let dirs = RNFetchBlob.fs.dirs;

const HomeMenu = ({ navigation }) => {
  // React.useEffect(() => {
  //   listFiles();
  // }, []);

  // const listFiles = async () => {
  //   try {
  //     // RNFetchBlob.fs.ls(dirs.DCIMDir).then((files) => console.log({ files }));
  //     // console.log({ list });

  //     RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  //       .then((result) => {
  //         console.log('GOT RESULT', result);

  //         // stat the first file
  //         return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  //       })
  //       .then((statResult) => {
  //         if (statResult[0].isFile()) {
  //           // if we have a file, read it
  //           return RNFS.readFile(statResult[1], 'utf8');
  //         }

  //         return 'no file';
  //       })
  //       .then((contents) => {
  //         // log the file contents
  //         console.log(contents);
  //       })
  //       .catch((err) => {
  //         console.log(err.message, err.code);
  //       });
  //   } catch (error) {
  //     console.log({ error: error.message });
  //   }
  // };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('ItvScreen')}>
        <View style={styles.iconwrap}>
          <Itv />
        </View>
        <Text style={styles.label}>iTV</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('ImovieScreen')}>
        <View style={styles.iconwrap}>
          <Imovie />
        </View>
        <Text style={styles.label}>iMovie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('IsportsScreen')}>
        <View style={styles.iconwrap}>
          <Isports />
        </View>
        <Text style={styles.label}>iSports</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('IplayScreen')}>
        <View style={styles.iconwrap}>
          <Iplay />
        </View>
        <Text style={styles.label}>iPlay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('IradioScreen')}>
        <View style={styles.iconwrap}>
          <Iradio />
        </View>
        <Text style={styles.label}>iRadio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuitem} onPress={() => navigation.replace('ImusicScreen')}>
        <View style={styles.iconwrap}>
          <Imusic />
        </View>
        <Text style={styles.label}>iMusic</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuitem: { width: '33.33%', alignItems: 'center', marginBottom: 30 },
  iconwrap: { borderRadius: 28, overflow: 'hidden' },
  label: { marginTop: 10 }
});

export default HomeMenu;
