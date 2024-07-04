import { config } from 'dotenv';
import path from 'path';

config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  JWKS_URI,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const Config = {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  JWKS_URI,
  REFRESH_TOKEN_SECRET,
};
