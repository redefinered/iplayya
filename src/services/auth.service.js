import axios from 'axios';

export const hello = (name) => {
  return { name };
};

export const signIn = async () => {
  try {
    const { data } = await axios('http://localhost:3000/users/1')
    return data;
  } catch (error) {
    throw new Error('Error logging in');
  }
};
