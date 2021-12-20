/* eslint-disable react/prop-types */

import React, { createContext } from 'react';

export const MovieContext = createContext({ selected: null, setSelected: () => {} });

const MovieContextProvider = ({ children }) => {
  const [selected, setSelected] = React.useState(null);

  return (
    <MovieContext.Provider value={{ selected, setSelected }}>{children}</MovieContext.Provider>
  );
};

export default MovieContextProvider;
