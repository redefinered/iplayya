import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';

import { connect } from 'react-redux';
import { selectMoviesByCategory } from 'modules/ducks/movies/movies.selectors';

import { urlEncodeTitle } from 'utils';

const CategoryScroll = ({ id, movies: { videos }, onSelect }) => {
  let movies = videos.map(({ thumbnail, ...rest }) => {
    return {
      thumbnail:
        thumbnail === '' || thumbnail === 'N/A'
          ? `http://via.placeholder.com/115x170.png?text=${urlEncodeTitle(rest.title)}`
          : thumbnail,
      ...rest
    };
  });

  console.log({ movies });

  return (
    <View style={{ marginBottom: 30 }}>
      <ContentWrap>
        <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>{id}</Text>
      </ContentWrap>
      <ScrollView style={{ paddingHorizontal: 10 }} horizontal bounces={false}>
        {movies.map(({ id, thumbnail: url }) => (
          <Pressable key={id} style={{ marginRight: 10 }} onPress={() => onSelect()}>
            <Image style={{ width: 115, height: 170, borderRadius: 8 }} source={{ url }} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

CategoryScroll.propTypes = {
  id: PropTypes.string,
  movies: PropTypes.array,
  onSelect: PropTypes.func
};

const mapStateToProps = (state, props) => {
  return {
    movies: selectMoviesByCategory(state, props)
  };
};

export default connect(mapStateToProps)(CategoryScroll);
