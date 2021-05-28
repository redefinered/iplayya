/* eslint-disable react/prop-types */

import React from 'react';
import { ScrollView } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import SwitchOption from 'components/switch-option/switch-option.component';
import DropdownOption from 'components/dropdown-option/dropdown-option.component';
import RadioOption from 'components/radio-option/radio-option.component';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectPlaybackSettings,
  selectUpdated
} from 'modules/ducks/user/user.selectors';

import languages from 'common/languages.json';

/**
 * TODO: hasUnsavedChanges is being set to true on mount.
 * FIX or else every time a user goes back the app will request to update settings even thought there are no changes made
 */
class PlaybackSettings extends React.Component {
  constructor(props) {
    super(props);

    const {
      is_autoplay_video,
      is_autoplay_next_ep,
      is_show_video_info,
      is_always_show_caption,
      language,
      subtitle,
      video_quality
    } = props.playbackSettings;

    this.state = {
      is_autoplay_video,
      is_autoplay_next_ep,
      is_show_video_info,
      is_always_show_caption,
      language,
      subtitle,
      video_quality,
      hasUnsavedChanges: false
    };
  }

  componentDidMount() {
    this.props.updatePlaybackSettingsStartAction();

    this.props.navigation.addListener('beforeRemove', (e) => {
      const { hasUnsavedChanges, ...input } = this.state;

      if (!hasUnsavedChanges) {
        // If we don't have unsaved changes, then we don't need to do anything
        return;
      }

      e.preventDefault();

      // update user settings
      this.props.updatePlaybackSettingsAction({ input });
    });
    this.props.enableSwipeAction(false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      const { updated } = this.props;
      if (updated) {
        this.setState({ hasUnsavedChanges: false }, () => {
          this.props.navigation.goBack();
        });
      }
    }
  }

  toggleSwitchOption = (name) => {
    this.setState({ [name]: !this.state[name], hasUnsavedChanges: true });
  };

  handleLanguageSelect = (language) => {
    this.setState({
      language: language ? language.label : 'Select one',
      hasUnsavedChanges: true
    });
  };

  handleSubtitleSelect = (language) => {
    this.setState({
      subtitle: language ? language.label : 'Select one',
      hasUnsavedChanges: true
    });
  };

  handleVideoQualitySelect = (video_quality) => {
    this.setState({ video_quality, hasUnsavedChanges: true });
  };

  componentWillUnmount() {
    this.props.navigation.removeListener('beforeRemove');
  }

  render() {
    console.log({ hasUnsavedChanges: this.state.hasUnsavedChanges });
    const languageChoices = Object.keys(languages).map((key) => ({
      key,
      label: languages[key].name,
      value: key
    }));

    const videoQualityChoices = [
      { label: 'High', value: 'high' },
      { label: 'Medium', value: 'medium' },
      { label: 'Low', value: 'low' },
      { label: 'Auto', value: 'auto' }
    ];

    const {
      is_autoplay_video,
      is_autoplay_next_ep,
      is_show_video_info,
      is_always_show_caption,
      language,
      subtitle,
      video_quality
    } = this.state;

    const { theme } = this.props;
    return (
      <ContentWrap style={{ marginTop: 20 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 30 }}>
            Set your video watching experience.
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontWeight: 'bold',
              color: theme.iplayya.colors.white50,
              marginBottom: 20
            }}
          >
            Video playback settings
          </Text>
          <SwitchOption
            name="is_autoplay_video"
            label="Auto-play video"
            value={is_autoplay_video}
            toggleAction={this.toggleSwitchOption}
          />
          <SwitchOption
            name="is_autoplay_next_ep"
            value={is_autoplay_next_ep}
            label="Auto-play next episode"
            toggleAction={this.toggleSwitchOption}
          />
          <SwitchOption
            name="is_show_video_info"
            value={is_show_video_info}
            label="Show in-video info at start"
            toggleAction={this.toggleSwitchOption}
          />
          <DropdownOption
            optionLabel="Language"
            choices={languageChoices}
            currentValue={languageChoices.find(({ label }) => label === language)}
            onSelect={this.handleLanguageSelect}
          />
          <DropdownOption
            optionLabel="Subtitles"
            choices={languageChoices}
            currentValue={languageChoices.find(({ label }) => label === subtitle)}
            onSelect={this.handleSubtitleSelect}
          />
          <SwitchOption
            name="is_always_show_caption"
            value={is_always_show_caption}
            label="Show in-video info at start"
            toggleAction={this.toggleSwitchOption}
          />
          <RadioOption
            currentValue={videoQualityChoices.find(({ value }) => value === video_quality)['value']}
            choices={videoQualityChoices}
            onSelect={this.handleVideoQualitySelect}
          />
        </ScrollView>
      </ContentWrap>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <PlaybackSettings {...props} />
  </ScreenContainer>
);

const actions = {
  updatePlaybackSettingsStartAction: UserCreators.updatePlaybackSettingsStart,
  updatePlaybackSettingsAction: UserCreators.updatePlaybackSettings,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  playbackSettings: selectPlaybackSettings,
  updated: selectUpdated
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
