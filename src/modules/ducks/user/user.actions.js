import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    reset: [],
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
