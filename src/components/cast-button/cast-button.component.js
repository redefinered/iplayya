/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';
import { createStructuredSelector } from 'reselect';
import { selectMovie } from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';

const GoogleCastButton = ({ movie, source: contentUrl }) => {
  const client = useRemoteMediaClient();
  const { title, seriesTitle, thumbnail, description: subtitle, year: releaseDate, time } = movie;

  console.log({ contentUrl });

  React.useEffect(() => {
    if (client) {
      loadMedia();

      // getChromecastStatus();
    }
  }, [client]);

  const loadMedia = async () => {
    try {
      await client.loadMedia({
        autoplay: false,
        mediaInfo: {
          contentUrl,
          // contentType: 'video/mp4',
          metadata: {
            images: [
              {
                url: thumbnail
              }
            ],
            title: seriesTitle || title,
            subtitle,
            // studio: 'Blender Foundation',
            type: 'movie',
            releaseDate
          },
          streamDuration: time * 60
        },
        startTime: 10 // seconds
      });
    } catch (error) {
      console.log({ error });
    }
  };

  // const getChromecastStatus = async () => {
  //   const mediastatus = await client.getMediaStatus();

  //   console.log({ mediastatus });
  // };

  return <CastButton style={{ width: 24, height: 24, tintColor: 'white' }} tintColor="white" />;
};

GoogleCastButton.propTypes = {
  movie: PropTypes.object,
  source: PropTypes.string,
  paused: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({ movie: selectMovie });

export default connect(mapStateToProps)(GoogleCastButton);
