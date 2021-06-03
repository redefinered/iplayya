/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';
import { createStructuredSelector } from 'reselect';
import { selectMovie } from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';

const GoogleCastButton = ({ movie, source: contentUrl, seriesTitle }) => {
  const client = useRemoteMediaClient();
  const { title, thumbnail, description: subtitle, year: releaseDate, time } = movie;

  React.useEffect(() => {
    if (client) {
      loadMedia(contentUrl);

      // getChromecastStatus();
    }
  }, [client, contentUrl]);

  const loadMedia = async (contentUrl) => {
    const castTitle = seriesTitle ? `${title} - ${seriesTitle}` : title;
    try {
      await client.loadMedia({
        // autoplay: false,
        mediaInfo: {
          contentUrl,
          // contentType: 'application/x-mpegURL',
          // streamType: 'other',
          metadata: {
            images: [
              {
                url: thumbnail
              }
            ],
            title: castTitle,
            subtitle,
            // studio: 'Blender Foundation',
            type: 'movie',
            releaseDate
          },
          streamDuration: time * 60
        }
        // startTime: currentTime // seconds
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
  paused: PropTypes.bool,
  seriesTitle: PropTypes.string
};

const mapStateToProps = createStructuredSelector({ movie: selectMovie });

export default connect(mapStateToProps)(GoogleCastButton);
