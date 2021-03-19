import React from 'react';
import { gql } from '@apollo/client';
import { clientWithoutAuthLink } from 'apollo/client';
import { Text, View } from 'react-native';

const QUERY = gql`
  {
    Media(id: 1) {
      id
    }
  }
`;

const TestQuery = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    query();
  }, []);

  const query = async () => {
    try {
      const { data } = await clientWithoutAuthLink.query({
        query: QUERY
      });
      setData(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  console.log({ data, loading, error });

  if (!data || loading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Working...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`Request success ${data.Media.id}`}</Text>
    </View>
  );
};

export default TestQuery;
