import { gql } from '@apollo/client';
import client from 'apollo/client';

export const getProfile = async () => {
  try {
    const { data } = await client.query({
      query: gql`
        {
          me {
            name
            email
            username
            phone
            birth_date
            gender
          }
        }
      `
    });
    return data;
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }
};
