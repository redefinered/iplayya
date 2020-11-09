import { gql } from '@apollo/client';
import client from 'apollo/client';

export const getMovies = async (args) => {
  const { first, page } = args;
  try {
    const { data } = await client.query({
      query: gql`
        query GET_MOVIES($first: Int, $page: Int) {
          movies(first: $first, page: $page) {
            data {
              id
            }
          }
        }
      `,
      variables: { first, page }
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
