/* eslint-disable no-useless-catch */
import { cloneDeep } from 'lodash';
import { slugify } from '~/utils/formatters';
import { cardModel } from '~/models/cardModel';
import { boardModel } from '~/models/boardModel';
import { columnModel } from '~/models/columnModel';
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

    // Deep clone board là tạo ra một cái mới để xử lý, không ảnh hưởng tới cái board ban đầu
    const resBoard = cloneDeep(board);

    // Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      // Cách này convert ObjectId về string bằng hàm toString() của JavaScript
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );

      // Trong mongodb có support hàm equals cho ObjectId
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    // Xóa card khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Khi di chuyển card sang column khác:
    // B1: Cập nhật mảng cardOrderIds của column ban đầu chứa nó (xóa _id của card ra khỏi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now(),
    });
    // B2: Cập nhật mảng cardOrderIds của column tiếp theo (thêm _id của card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now(),
    });
    // B3: Cập nhật lại trường columnId mới của cái card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    })
    return { updateResult: 'Successfully!' };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
