import { gql } from '@apollo/client';

export const UPDATE_PLAYBACK_SETTINGS = gql`
  mutation UPDATE_PLAYBACK_SETTINGS($input: updatePlaybackSettingInput) {
    updatePlaybackSetting(input: $input) {
      id
    }
  }
`;
