import { urlEncodeTitle } from 'utils';

export const dummydata = [
  {
    id: 1,
    title: 'Movie Number One',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('Movie Number One')}`
  },
  {
    id: 2,
    title: 'Another Sample Movie',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'Another Sample Movie'
    )}`
  },
  {
    id: 3,
    title: 'Lorem Ipsum Reloaded',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'Lorem Ipsum Reloaded'
    )}`
  },
  {
    id: 4,
    title: 'The Dark Example',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('The Dark Example')}`
  },
  {
    id: 5,
    title: 'John Weak 5',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle('John Weak 5')}`
  },
  {
    id: 6,
    title: 'The Past and The Furriest 8',
    chanel: 'Nickolodeon',
    date: 'Sep 27, 2020',
    time: '09:00 AM - 11:00 AM',
    thumbnail: `http://via.placeholder.com/240x133.png?text=${urlEncodeTitle(
      'The Past and The Furriest 8'
    )}`
  }
];

export const categories = [
  {
    id: '1',
    label: 'All Sports',
    name: 'all'
  },
  {
    id: '2',
    label: 'Football',
    name: 'football'
  },
  {
    id: '3',
    label: 'Baseball',
    name: 'baseball'
  },
  {
    id: '4',
    label: 'Basketball',
    name: 'basketball'
  }
];
