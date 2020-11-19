import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions(
  {
    setCurrentUser: ['data'],
    removeCurrentUser: [],
    skipProviderAdd: [],
    updatePlaybackSettings: ['data'],
    updatePlaybackSettingsSuccess: [],
    updatePlaybackSettingsFailure: ['error']
  },
  { prefix: '@User/' }
);

export { Types, Creators };
