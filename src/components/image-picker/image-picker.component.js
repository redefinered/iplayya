import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { View, PermissionsAndroid, Platform, StyleSheet, Dimensions } from 'react-native';
import Button from 'components/button/button.component';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';

const ImagePick = ({ hideModalCamera, setProfileImage }) => {
  const [filePath, setFilePath] = useState();
  const theme = useTheme();

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'App needs camera permission'
        });
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission'
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        console.log('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
      saveToPhotos: false
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          console.log('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          console.log('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          console.log(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.base64);
        console.log('uri -> ', response.uri);
        console.log('width -> ', response.width);
        console.log('height -> ', response.height);
        console.log('fileSize -> ', response.fileSize);
        console.log('type -> ', response.type);
        console.log('fileName -> ', response.fileName);
        const source = { uri: response.uri };
        console.log('x', source);
        setFilePath(source.uri);
        hideModalCamera();
      });
    }
  };

  const chooseFile = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        console.log('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        console.log('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        console.log(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.base64);
      console.log('uri -> ', response.uri);
      console.log('width -> ', response.width);
      console.log('height -> ', response.height);
      console.log('fileSize -> ', response.fileSize);
      console.log('type -> ', response.type);
      console.log('fileName -> ', response.fileName);
      const source = { uri: response.uri };
      console.log('y', source);
      setFilePath(source.uri);
      hideModalCamera();
    });
  };

  React.useEffect(() => {
    setProfileImage(filePath);
  }, [filePath]);

  return (
    <View style={styles.container}>
      <Button
        icon={() => <Icon name="camera" size={28} style={{ marginRight: 10 }} />}
        mode="contained"
        style={{ ...styles.takePictureStyle, backgroundColor: theme.iplayya.colors.vibrantpussy }}
        labelStyle={styles.textStyle}
        contentStyle={{ height: 50 }}
        onPress={() => captureImage('photo')}
      >
        Take Picture
      </Button>
      <Button
        mode="contained"
        icon={() => <Icon name="add-file" size={28} style={{ marginRight: 10 }} />}
        style={styles.browseImageStyle}
        labelStyle={styles.textStyle}
        contentStyle={{ height: 50 }}
        onPress={() => chooseFile('photo')}
      >
        Browse Image
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width - 20
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 18
  },
  takePictureStyle: {
    marginVertical: 10,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10
  },
  browseImageStyle: {
    backgroundColor: '#13BD38',
    marginVertical: 10,
    width: Dimensions.get('window').width - 50,
    borderRadius: 10,
    paddingLeft: 10
  }
});

ImagePick.propTypes = {
  hideModalCamera: PropTypes.func,
  setProfileImage: PropTypes.func
};

export default ImagePick;
