import { gql } from '@apollo/client';

export const GET_RADIO_STATIONS = gql`
  query GET_RADIO_STATIONS($input: radioRequest) {
    radios(input: $input) {
      id
      name
      number
      cmd
      count
      volume_correction
      enable_monitoring
      monitoring_status
      monitoring_status_updated
      is_favorite
    }
  }
`;

export const ADD_RADIO_TO_FAVORITES = gql`
  mutation ADD_RADIO_TO_FAVORITES($input: radioToFavoritesInput) {
    addRadioToFavorites(input: $input) {
      id
      is_favorite
    }
  }
`;

export const REMOVE_RADIO_FROM_FAVORITES = gql`
  mutation REMOVE_RADIO_FROM_FAVORITES($input: radioToFavoritesInput) {
    removeRadioToFavorites(input: $input) {
      id
      is_favorite
    }
  }
`;

export const GET_FAVORITE_RADIOS = gql`
  query GET_FAVORITE_RADIOS($input: radioRequest) {
    favoriteRadios(input: $input) {
      id
      name
      number
      cmd
      is_favorite
    }
  }
`;

export const SEARCH = gql`
  query SEARCH($input: radioRequest) {
    radios(input: $input) {
      id
      name
      number
      cmd
      is_favorite
    }
  }
`;
