import { Connection, createConnection } from 'typeorm';

let connection: Connection;

export const initConnection = async () => {
  connection = await createConnection({
    type: 'mysql',
    url: process.env.USER_SERVICE_DB_URL,
  });
};

const getConnection = () => connection;

export default getConnection;
