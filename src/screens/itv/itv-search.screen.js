/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import TextInput from 'components/text-input/text-input.component';
import suggestions from './suggestions.json';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createFontFormat } from 'utils';
import { compose } from 'redux';

const ItvSearchScreen = ({ theme }) => {
  const [term, setTerm] = React.useState('');

  const handleChange = (event) => {
    setTerm({ event });
  };

  return (
    <ContentWrap style={styles.container}>
      <TextInput
        name="search"
        returnKeyType="search"
        autoFocus
        handleChangeText={handleChange}
        value={term}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        keyboardType="email-address"
        autoCompleteType="email"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        placeholder="Search a movie"
        left={<RNPTextInput.Icon name={() => <Icon name="search" size={30} />} />}
        // onFocus={() => this.setState({ isolatedInputs: true })}
        // onBlur={() => this.setState({ isolatedInputs: false })}
      />
      <Text
        style={{
          ...createFontFormat(14, 19),
          fontWeight: '700',
          color: theme.iplayya.colors.white50,
          paddingVertical: 15
        }}
      >
        Suggested Search
      </Text>
      {suggestions.data.map(({ id, name }) => (
        <Pressable key={id}>
          <Text style={{ ...createFontFormat(16, 22), paddingVertical: 15 }}>{name}</Text>
        </Pressable>
      ))}
    </ContentWrap>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default compose(withHeaderPush({ backgroundType: 'solid' }), withTheme)(ItvSearchScreen);
