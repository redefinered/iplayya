/* eslint-disable react/prop-types */

import React from 'react';
import { View, StyleSheet, /*TouchableOpacity,*/ Pressable } from 'react-native';
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
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.navigate('ItvScreen')}
      >
        <View style={styles.iconwrap}>
          <Itv height={85} width={85} />
        </View>
        <Text style={styles.label}>iTV</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.replace('ImovieScreen')}
      >
        <View style={styles.iconwrap}>
          <Imovie height={85} width={85} />
        </View>
        <Text style={styles.label}>iMovie</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.replace('IsportsScreen')}
      >
        <View style={styles.iconwrap}>
          <Isports height={85} width={85} />
        </View>
        <Text style={styles.label}>iSports</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.replace('IplayScreen')}
      >
        <View style={styles.iconwrap}>
          <Iplay height={85} width={85} />
        </View>
        <Text style={styles.label}>iPlay</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.replace('IradioScreen')}
      >
        <View style={styles.iconwrap}>
          <Iradio height={85} width={85} />
        </View>
        <Text style={styles.label}>iRadio</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgba(0,0,0,0.20)' : null
          },
          styles.menuitem
        ]}
        onPress={() => navigation.replace('ImusicScreen')}
      >
        <View style={styles.iconwrap}>
          <Imusic height={85} width={85} />
        </View>
        <Text style={styles.label}>iMusic</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuitem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 0,
    padding: 10
  },
  iconwrap: { borderRadius: 28, overflow: 'hidden' },
  label: { marginTop: 10 }
});

export default HomeMenu;
