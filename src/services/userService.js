import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import ApiError from '~/utils/ApiError';
import { pickUser } from '~/utils/formatters';
import { userModel } from '~/models/userModel';

const createNew = async (reqBody) => {
  try {
    // Kiểm tra email đã tồn tại trong hệ thống chưa?
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
    }
    // Tạo data để lưu vào db
    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4(),
    };
    // Lưu vào db
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);
    return pickUser(getNewUser);
    // Gửi mail để người dùng xác thực tài khoản
    // Trả về dữ liệu cho phía controller
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
