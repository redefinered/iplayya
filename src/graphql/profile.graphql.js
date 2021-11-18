import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GET_PROFILE {
    me {
      id
      name
      email
      username
      first_name
      last_name
      phone
      birth_date
      gender
      onboardinginfo
      providers {
        id
        user_id
        name
        portal_address
        username
        password
        created_at
        is_active
      }
      playback {
        id
        user_id
        language
        subtitle
        video_quality
        is_autoplay_video
        is_autoplay_next_ep
        is_show_video_info
        is_always_show_caption
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE($input: updateUserProfileInput) {
    updateUserProfile(input: $input) {
      id
    }
  }
`;
