/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, TextInput as FormInput, View, FlatList } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { createFontFormat } from 'utils';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectVideoFiles } from 'modules/ducks/iplay/iplay.selectors';
import MediaItem from './media-item.component';

const IplaySearchScreen = ({ navigation, isFetching, videoFiles }) => {
  const theme = useTheme();
  const [term, setTerm] = React.useState('');
  const [data, setData] = React.useState([]);

  const handleChange = (value) => {
    setTerm(value);
  };

  React.useEffect(() => {
    if (term.length) {
      const d = videoFiles.filter(
        ({ name }) => name.toLowerCase().search(term.toLowerCase()) !== -1
      );
      console.log('ww', d);
      setData(d);
    } else {
      setData([]);
    }
    // if (term.length) {
    //   if (term.length <= 2) return;
    //   search(term);
    // }
  }, [term]);

  const handleItemPress = ({ id, ...rest }) => {
    // navigate to chanel details screen with `id` parameter
    navigation.popToTop();
    navigation.push('IplayDetailScreen', { file: { id, ...rest } });
  };

  const onSubmitEditing = () => {
    if (term.length) {
      setTerm(term);
    } else {
      return;
    }
  };

  const renderResult = () => {
    if (data.length)
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ContentWrap>
              <Text
                style={{
                  ...createFontFormat(14, 19),
                  fontWeight: '700',
                  color: theme.iplayya.colors.white50,
                  paddingVertical: theme.spacing(2)
                }}
              >
                Search Results
              </Text>
            </ContentWrap>
          }
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item: { ...video } }) => {
            const filesize = video.size / 1e6;
            return (
              <MediaItem
                visible={false}
                selected={false}
                filesize={filesize}
                onSelect={handleItemPress}
                {...video}
              />
            );
          }}
        />
      );
  };

  return (
    <View style={styles.container}>
      <ContentWrap>
        <TextInput
          render={(props) => (
            <FormInput
              {...props}
              style={{
                flex: 1,
                justifyContent: 'center',
                marginLeft: 40,
                fontSize: 16,
                color: '#ffffff'
              }}
            />
          )}
          name="search"
          returnKeyType="search"
          autoFocus
          showSoftInputOnFocus={true}
          onSubmitEditing={(term) => onSubmitEditing(term)}
          handleChangeText={(term) => handleChange(term)}
          value={term}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          autoCompleteType="email"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 0 }}
          placeholder="Search a Video"
          left={
            <RNPTextInput.Icon
              name={() => {
                return isFetching ? (
                  <Icon
                    name="search"
                    size={theme.iconSize(4)}
                    style={{ marginRight: theme.spacing(-0.3) }}
                  />
                ) : (
                  <Icon
                    name="search"
                    size={theme.iconSize(4)}
                    style={{ marginRight: theme.spacing(-0.3) }}
                  />
                );
              }}
            />
          }
        />
      </ContentWrap>
      {renderResult()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IplaySearchScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  videoFiles: selectVideoFiles
});

const enhance = compose(connect(mapStateToProps));

export default enhance(Container);
