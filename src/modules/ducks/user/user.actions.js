import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    reset: [],
    setProvider: ['id'],
    setProviderSuccess: ['id'],
    setProviderFailure: ['error'],
    setCurrentUser: ['data'],
    hideWelcomeDialog: [],
    removeCurrentUser: [],
    skipProviderAdd: [],
    updatePlaybackSettingsStart: [],
    updatePlaybackSettings: ['data'],
    updatePlaybackSettingsSuccess: [],
    updatePlaybackSettingsFailure: ['error']
  },
  { prefix: '@User/' }
);

export { Types, Creators };
