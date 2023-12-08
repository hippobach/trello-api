import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.max': 'Title min 3 characters long',
      'string.min': 'Title max 50 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace',
    }),
    description: Joi.string().required().min(3).max(255).trim().strict(),
  });

  try {
    // abortEarly: false chỉ định trường hợp có nhiều lỗi validate thì trả về hết
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate dữ liệu hợp lệ thì mới cho đi tiếp sang controller
    next()
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = {
  createNew,
};