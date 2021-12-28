import { createContext } from 'react';

const VolumeContext = createContext({
  volume: 0,
  setVolume: () => {}
});

export default VolumeContext;
