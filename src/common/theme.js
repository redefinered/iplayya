/**
 * dark (boolean): whether this is a dark theme or light theme
 * mode ('adaptive' | 'exact'): color mode for dark theme
 * roundness (number): roundness of common elements, such as buttons
 * colors (object): various colors used throughout different elements
 *  primary - primary color for your app, usually your brand color
 *  accent - secondary color for your app which complements the primary color
 *  background - background color for pages, such as lists
 *  surface - background color for elements containing content, such as cards
 *  text - text color for content
 *  disabled - color for disabled elements
 *  placeholder - color for placeholder text, such as input placeholder
 *  backdrop - color for backdrops of various components such as modals
 * fonts (object): various fonts used throughout different elements
 *  regular
 *  medium
 *  light
 *  thin
 * animation (object)
 *  scale - scale for all animations
 */

import { DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal'
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal'
    }
  }
};

export default {
  ...DefaultTheme,
  // dark: true,
  fonts: configureFonts(fontConfig),
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E34398',
    accent: '#E34398',
    text: 'white',
    disabled: 'rgba(255,255,255,0.10)' // white10
  },
  iplayya: {
    colors: {
      success: '#13BD38',
      gooddawn: ['#F54997', '#3D06FF'],
      twilight: ['#2D1449', '#0D0637'],
      midnight: ['#0D111D', '#3D099D'],
      vibrantpussy: '#E34398',
      strongpussy: '#B4166A',
      bluespike: '#3D06FF',
      purpleog: '#7219E2',
      goodnight: '#0D111D',
      black100: '#0D111D',
      black90: 'rgba(13, 17, 29, 0.9)',
      black80: 'rgba(13, 17, 29, 0.8)',
      black70: 'rgba(13, 17, 29, 0.7)',
      black50: 'rgba(13, 17, 29, 0.5)',
      black25: 'rgba(13, 17, 29, 0.25)',
      black10: 'rgba(13, 17, 29, 0.1)',
      white100: '#FFFFFF',
      white90: 'rgba(255,255,255,0.9)',
      white80: 'rgba(255,255,255,0.8)',
      white70: 'rgba(255,255,255,0.7)',
      white50: 'rgba(255,255,255,0.5)',
      white25: 'rgba(255,255,255,0.25)',
      white10: 'rgba(255,255,255,0.1)'
    },
    zIndex: {
      bottomTabs: 1100,
      nowPlaying: 1200,
      loader: 1300
    },
    bodyp: {
      fontSize: 14,
      lineHeight: 19,
      marginBottom: 15
    }
  },
  spacing: (multiply) => 6 * multiply,
  iconSize: (multiply) => 8 * multiply
};
