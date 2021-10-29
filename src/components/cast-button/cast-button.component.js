/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectMovie } from 'modules/ducks/movies/movies.selectors';
import { selectChannel } from 'modules/ducks/itv/itv.selectors';

const GoogleCastButton = ({ movie, channel, source: contentUrl, seriesTitle }) => {
  const [state, setState] = React.useState();
  const client = useRemoteMediaClient();

  React.useEffect(() => {
    if (movie) {
      const { title, thumbnail, description: subtitle, year: releaseDate, time } = movie;

      setState({ title, thumbnail, description: subtitle, year: releaseDate, time });
    }

    if (channel) {
      const { title, description: subtitle } = channel;

      setState({ title, thumbnail: null, description: subtitle, year: null, time: null });
    }
  }, [movie, channel]);

  React.useEffect(() => {
    if (client) {
      loadMedia(contentUrl);

      // getChromecastStatus();
    }
  }, [client, contentUrl]);

  const loadMedia = async (contentUrl) => {
    if (!state) return;

    const { title, thumbnail, description: subtitle, year: releaseDate, time } = state;

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

const mapStateToProps = createStructuredSelector({ movie: selectMovie, channel: selectChannel });

export default connect(mapStateToProps)(GoogleCastButton);
