import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 3000;

export const Config = {
  PORT,
  NODE_ENV,
};
