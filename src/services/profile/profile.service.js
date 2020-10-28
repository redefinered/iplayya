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
          }
        }
      `
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
