/* eslint-disable react/prop-types */

import React, { createContext } from 'react';

export const MovieContext = createContext({
  selected: null,
  setSelected: () => {},
  downloads: [],
  setDownloads: () => {}
});

const MovieContextProvider = ({ children }) => {
  const [selected, setSelected] = React.useState(null);
  const [downloads, setDownloads] = React.useState(null);

  return (
    <MovieContext.Provider value={{ selected, setSelected, downloads, setDownloads }}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContextProvider;
