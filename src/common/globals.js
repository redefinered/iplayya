import { getStatusBarHeight } from 'react-native-status-bar-height';

// status bar height
const statusbarHeight = getStatusBarHeight();
const headerButtonHeight = 54; //44
const headerSpaceFromTopToButtons = 94; //74

export const headerHeight = headerButtonHeight + headerSpaceFromTopToButtons - statusbarHeight;

export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  UNREAD: 'unread',
  READ: 'read'
};

export const MODULE_TYPES = {
  VOD: 'vod',
  TV: 'tv'
};

export const PAGINATOR_LIMIT = 100;

export const IMOVIE_PAGINATOR_INFO_LIMIT = 10;

export const IMOVIE_CATEGORY_PAGINATOR_LIMIT = 5;
