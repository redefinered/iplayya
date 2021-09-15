/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, TextInput as FormInput, View, FlatList, Pressable } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import ContentWrap from 'components/content-wrap.component';
import { TextInput as RNPTextInput } from 'react-native-paper';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectRadioStations } from 'modules/ducks/iradio/iradio.selectors';

const IradioSearchScreen = ({ navigation, radioStations }) => {
  const theme = useTheme();
  const [term, setTerm] = React.useState('');
  const [data, setData] = React.useState([]);

  const handleChange = (value) => {
    setTerm(value);
  };

  React.useEffect(() => {
    if (term.length) {
      const d = radioStations.filter(({ name }) => name.toLowerCase().search(term) !== -1);
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
    navigation.push('IradioScreen', { file: { id, ...rest } });
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
          renderItem={({ item: { name } }) => {
            return (
              <React.Fragment>
                <Pressable
                  onPress={() => handleItemPress()}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? 'rgba(0,0,0,0.28)' : 'transparent',
                      paddingHorizontal: theme.spacing(2),
                      paddingVertical: theme.spacing(2)
                    }
                  ]}
                >
                  <ContentWrap
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16) }}>
                        {name}
                      </Text>
                    </View>
                  </ContentWrap>
                </Pressable>
              </React.Fragment>
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
                return (
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
    <IradioSearchScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const mapStateToProps = createStructuredSelector({
  radioStations: selectRadioStations
});

const enhance = compose(connect(mapStateToProps));

export default enhance(Container);
