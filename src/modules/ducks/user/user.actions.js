import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    userStart: null,
    setProvider: ['id'],
    setProviderSuccess: ['id'],
    setProviderFailure: ['error'],
    // hideWelcomeDialog: [],
    skipProviderAdd: [],
    updatePlaybackSettingsStart: [],
    updatePlaybackSettings: ['data'],
    updatePlaybackSettingsSuccess: [],
    updatePlaybackSettingsFailure: ['error']
  },
  { prefix: '@User/' }
);

export { Types, Creators };
