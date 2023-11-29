/* eslint-disable no-console */
import express from 'express';
import exitHook from 'async-exit-hook';
import { env } from './config/environment';
import { CONNECT_DB, GET_DB, CLOSE_DB } from './config/mongodb';

const START_SERVER = () => {
  const app = express();

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.end('<h1>Hello World!</h1><hr>');
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello ${env.AUTHOR}, Back-end server is running at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    CLOSE_DB();
  });
};

// Chỉ khi kết nối thành công tới database thì mới start server backend lên
// IIFE - Immediately Invoked Function Expression
(async () => {
  try {
    console.log('Connecting to database');
    await CONNECT_DB();
    console.log('Connected to database');
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();

// Chỉ khi kết nối thành công tới database thì mới start server backend lên
// CONNECT_DB()
//   .then(() => console.log('Connected to mongodb atlas'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.log(error);
//     process.exit(0);
//   });
