import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Pressable, Image } from 'react-native';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import { Text, withTheme } from 'react-native-paper';
import { urlEncodeTitle, createFontFormat } from 'utils';

const IradioFeaturedItems = ({ theme, featuredItems, handleRadioSelect, addToFavorites }) => (
  <View style={{ marginBottom: 30 }}>
    <ContentWrap>
      <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>Popular Radio Stations</Text>
    </ContentWrap>
    <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
      {featuredItems.map(({ id, name, is_favorite }) => (
        <Pressable onPress={() => handleRadioSelect(id)} key={id} style={{ marginRight: 10 }}>
          <Image
            style={{ width: 240, height: 133, borderRadius: 8 }}
            source={{
              url: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(name)}`
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 10
            }}
          >
            <Text style={{ fontWeight: 'bold', ...createFontFormat(16, 19) }}>{name}</Text>
            <Pressable
              onPress={() => addToFavorites(id)}
              style={{
                marginRight: 15
              }}
            >
              <Icon
                name="heart-solid"
                size={theme.iconSize(3)}
                style={{
                  color: is_favorite ? theme.iplayya.colors.vibrantpussy : 'white'
                }}
              />
            </Pressable>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

IradioFeaturedItems.propTypes = {
  theme: PropTypes.object,
  featuredItems: PropTypes.array,
  addToFavorites: PropTypes.func,
  handleRadioSelect: PropTypes.func
};

export default withTheme(IradioFeaturedItems);
