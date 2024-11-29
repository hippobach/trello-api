import { env } from '~/config/environment';
// Những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173',
  // v.v ví dụ sau này deploy lên domain chính thức
  'https://trello-web-bay-alpha.vercel.app',
];

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;
