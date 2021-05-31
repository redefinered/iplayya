module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null // this will disable autolinking for this package on iOS
      }
    },
    'react-native-image-picker': {
      platforms: {
        ios: null
      }
    }
  },
  project: {
    ios: {},
    android: {} // grouped into "project"
  },
  assets: ['./src/assets/fonts/']
};
