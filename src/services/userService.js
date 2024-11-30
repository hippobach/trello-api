import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import ApiError from '~/utils/ApiError';
import { env } from '~/config/environment';
import { pickUser } from '~/utils/formatters';
import { userModel } from '~/models/userModel';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { BrevoProvider } from '~/providers/BrevoProvider';
import { JwtProvider } from '~/providers/JwtProvider';

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

    // Gửi mail để cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject = 'Please verify your email before using our service!';
    const htmlContent = `
    <h3>Here is your verification link:</h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely, <br/> Bach Nguyen</h3>`;

    // Gọi tới provider gửi mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);

    // Trả về dữ liệu cho phía controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    //  Truy vấn user trong db
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    }
    if (existUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is already active'
      );
    }
    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid');
    }

    const updateData = {
      isActive: true,
      verifyToken: null,
    };
    const updatedUser = await userModel.update(existUser._id, updateData);
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    }
    if (!existUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active'
      );
    }
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your email or password is incorrect'
      );
    }
    /** Tạo tokens đăng nhập để trả về cho phía FE */
    // Tạo thông tin sẽ đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
    };

    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );
    // Trả về thông tin của user kèm theo 2 cái token vừa tạo
    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
};
