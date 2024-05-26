import { boardModel } from '~/models/boardModel';
import { columnModel } from '~/models/columnModel';

const createNew = async (reqBody) => {
  try {
    const newColumn = { ...reqBody };
    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      // Xử lý cấu trúc data trước khi trả về
      getNewColumn.cards = [];
      // Cập nhật lại bảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
};
