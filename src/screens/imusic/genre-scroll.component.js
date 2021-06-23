import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import GenreScrollList from './genre-scroll-list';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import { selectAlbumsByGenre, selectPaginatorOfGenre } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';

const GenreScroll = ({ genre, albums: { albums }, onSelect, paginatorOfGenre }) => {
  return (
    <View style={{ marginBottom: 30 }}>
      <ContentWrap>
        <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>{genre}</Text>
      </ContentWrap>
      <GenreScrollList data={albums} onSelect={onSelect} paginatorOfGenre={paginatorOfGenre} />
    </View>
  );
};

GenreScroll.propTypes = {
  id: PropTypes.string,
  albums: PropTypes.object,
  onSelect: PropTypes.func,
  genre: PropTypes.string,
  paginatorOfGenre: PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    albums: selectAlbumsByGenre(state, props),
    paginatorOfGenre: selectPaginatorOfGenre(state, props)
  };
};

export default connect(mapStateToProps)(GenreScroll);
