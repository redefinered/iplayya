import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import theme from 'common/theme';
import ListItemChanel from 'components/list-item-chanel/list-item-chanel.component';
import { useQuery } from '@apollo/client';
import { createFontFormat } from 'utils';
import { GET_TV_CHANNELS_BY_CATEGORIES } from 'graphql/itv.graphql';
import { useNavigation } from '@react-navigation/core';

const ITEM_HEIGHT = 96;
const channelplaceholder = require('assets/channel-placeholder.png');

const SimilarSearch = ({ results }) => {
  const navigation = useNavigation();
  const [list, setList] = React.useState([]);

  const { data } = useQuery(GET_TV_CHANNELS_BY_CATEGORIES, {
    variables: {
      input: { pageNumber: 1, limit: 6, categories: results.map(({ genre }) => genre) }
    },
    pollInterval: 300
  });

  console.log({ list, data });

  React.useEffect(() => {
    if (!data) return;

    setList(data.iptvs);
  }, [data]);

  const handleItemPress = ({ id }) => {
    // navigate to chanel details screen with `id` parameter
    navigation.navigate('ItvChannelDetailScreen', { channelId: id });
  };

  return (
    <FlatList
      ListHeaderComponent={
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(14, 19),
              fontWeight: '700',
              color: theme.iplayya.colors.white50,
              paddingVertical: theme.spacing(2)
            }}
          >
            Similar Search
          </Text>
        </ContentWrap>
      }
      data={list}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => {
        return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
      }}
      renderItem={({ item }) => (
        <ListItemChanel
          item={item}
          full
          // showepg={false}
          showFavoriteButton={false}
          isCatchUpAvailable={false}
          thumbnail={channelplaceholder}
          handleItemPress={handleItemPress}
        />
      )}
    />
  );
};

SimilarSearch.propTypes = {
  results: PropTypes.array
};

export default SimilarSearch;
