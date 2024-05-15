/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters';
import { boardModel } from '~/models/boardModel';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const createNew = async (reqBody) => {
  try {
    // Xử lý login dữ liệu tùy đặc thù
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) };

    // Gọi tới model để xử lý bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard);
    // Lấy bản ghi board sau khi gọi (tùy vào mục đích dự án)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // Làm thêm các xử lý logic khác với collection khác tùy vào đặc thù dự án
    // Bắn email, notification về cho admin khi có 1 board mới được tạo
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found');
    }
    return board;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
};
