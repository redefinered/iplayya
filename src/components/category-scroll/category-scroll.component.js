import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import CategoryScrollList from './category-scroll-list';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import {
  selectMoviesByCategory,
  selectPaginatorOfCategory
} from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';

import dummymusicdata from './dummy-music.json';

const CategoryScroll = ({
  datatype,
  category,
  movies: { videos },
  onSelect,
  paginatorOfCategory
}) => {
  const [data, setData] = React.useState([]);

  if (typeof videos === 'undefined' || videos.length === 0) return <View />;
  let movies = videos.map(({ thumbnail, ...rest }) => {
    return {
      thumbnail: thumbnail === '' || thumbnail === 'N/A' ? null : thumbnail,
      ...rest
    };
  });

  React.useEffect(() => {
    if (datatype === 'music') return setData(dummymusicdata);
    setData(movies);
  }, []);

  // console.log({ data });
  return (
    <View style={{ marginBottom: 30 }}>
      <ContentWrap>
        <Text style={{ fontSize: 16, lineHeight: 22, marginBottom: 15 }}>{category}</Text>
      </ContentWrap>
      <CategoryScrollList
        data={data}
        datatype={datatype}
        onSelect={onSelect}
        paginatorOfCategory={paginatorOfCategory}
      />
    </View>
  );
};

CategoryScroll.propTypes = {
  id: PropTypes.string,
  datatype: PropTypes.string,
  movies: PropTypes.object,
  onSelect: PropTypes.func,
  category: PropTypes.string,
  paginatorOfCategory: PropTypes.object
};

CategoryScroll.defaultProps = {
  datatype: 'movies'
};

const mapStateToProps = (state, props) => {
  return {
    movies: selectMoviesByCategory(state, props),
    paginatorOfCategory: selectPaginatorOfCategory(state, props)
  };
};

export default connect(mapStateToProps)(CategoryScroll);
