import express from 'express';
import { boardRoute } from './boardRoute';
import { cardRoute } from './cardRoute';
import { columnRoute } from './columnRoute';
import { StatusCodes } from 'http-status-codes';

const Router = express.Router();

// Check APIs V1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' });
});

// Board APIs
Router.use('/boards', boardRoute);

// Column APIs
Router.use('/columns', columnRoute);

// Board APIs
Router.use('/cards', cardRoute);

export const APIs_V1 = Router;
