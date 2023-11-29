/**
 * Code base for backend nodejs expressjs mongodb
 * hippobach
 * oFt2ImZh4ietC3Ro
 */
import { env } from './environment';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Khởi tạo một đối tượng trelloDatabaseInstance ban đầu là một đối tượng null (vì chưa connect)
let trelloDatabaseInstance = null;

// Khởi tạo một đối tượng mongoClientInstance để connect tới mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Kết nối tới database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới Mongodb Atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect();
  // Kết nối thành công thì lấy ra database theo tên và gán ngược lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Function GET_DB (không async) này có nhiệm vụ export ra trelloDatabaseInstance sau khi đã connect
// thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// Đảm bảo luôn gọi GET_DB sau khi đã kết nối thành công tới db
export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error('Must connect to database first');
  }
  return trelloDatabaseInstance;
};

// Đóng kết nối tới database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
