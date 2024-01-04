/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters';

const createNew = async (reqBody) => {
  try {
    // Xử lý login dữ liệu tùy đặc thù
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) };

    // Gọi tới model để xử lý bản ghi newBoard vào trong database
    // Làm thêm các xử lý logic khác với collection khác tùy vào đặc thù dự án
    // Bắn email, notification về cho admin khi có 1 board mới được tạo
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
