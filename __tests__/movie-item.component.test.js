/* eslint-disable no-undef */
import React from 'react';
import MovieItem from 'components/movie-item/movie-item.component';
import renderer from 'react-test-renderer';

it('renders if proprty title is "Test Title"', () => {
  const node = renderer.create(<MovieItem />).toJSON();
  expect(node).toMatchSnapshot();
});
