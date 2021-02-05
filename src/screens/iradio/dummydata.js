import { urlEncodeTitle } from 'utils';

export default [
  {
    id: 1,
    title: 'Station Number One',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('Station Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Station',
    favorite: true,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Another Sample Station'
    )}`
  },
  {
    id: 3,
    title: 'Lorem Ipsum Podcast',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'Lorem Ipsum Podcast'
    )}`
  },
  {
    id: 4,
    title: 'The Dark Radio',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('The Dark Radio')}`
  },
  {
    id: 5,
    title: 'John Weak Radio',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle('John Weak Radio')}`
  },
  {
    id: 6,
    title: 'The Past and The Furriest 8',
    favorite: false,
    thumbnail: `http://via.placeholder.com/336x190.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  }
];
