// Những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173',
  // v.v ví dụ sau này deploy lên domain chính thức
  'https://trello-web-bay-alpha.vercel.app'
];

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};
