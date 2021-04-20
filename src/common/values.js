import { getStatusBarHeight } from 'react-native-status-bar-height';

// status bar height
const statusbarHeight = getStatusBarHeight();
const headerButtonHeight = 64; //44
const headerSpaceFromTopToButtons = 94; //74

export const headerHeight = headerButtonHeight + headerSpaceFromTopToButtons - statusbarHeight;
