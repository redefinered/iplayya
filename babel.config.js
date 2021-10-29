module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['react-native-paper/babel', 'transform-remove-console'],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: {
          test: './test',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true
      }
    ]
  ],
};
