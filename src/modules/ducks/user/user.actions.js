import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setCurrentUser: ['data'],
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
