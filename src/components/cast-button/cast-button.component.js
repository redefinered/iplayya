import React from 'react';
import PropTypes from 'prop-types';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';
import { createStructuredSelector } from 'reselect';
import { selectMovie } from 'modules/ducks/movies/movies.selectors';
import { connect } from 'react-redux';

const GoogleCastButton = ({ movie, source: contentUrl }) => {
  console.log({ contentUrl });
  const { title, seriesTitle, thumbnail, description: subtitle, year: releaseDate, time } = movie;

  const client = useRemoteMediaClient();

  React.useEffect(() => {
    console.log({ client });
    cast();
  }, [client]);

  const cast = () => {
    if (client) {
      try {
        client.loadMedia({
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
    }
  };
  return <CastButton style={{ width: 30, height: 30, tintColor: 'white' }} tintColor="white" />;
};

GoogleCastButton.propTypes = {
  movie: PropTypes.object,
  source: PropTypes.string
};

const mapStateToProps = createStructuredSelector({ movie: selectMovie });

export default connect(mapStateToProps)(GoogleCastButton);
