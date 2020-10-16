import { getStatusBarHeight } from 'react-native-status-bar-height';

// status bar height
const statusbarHeight = getStatusBarHeight();
const headerButtonHeight = 44;
const headerSpaceFromTopToButtons = 74;

export const headerHeight = headerButtonHeight + headerSpaceFromTopToButtons - statusbarHeight;
