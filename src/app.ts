import 'reflect-metadata';

import express, { Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import cookieParser from 'cookie-parser';
import updateUserValidator from './validators/update-user-validator';
import { UpdateUserRequest } from './types';
import { validationResult } from 'express-validator';

const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello King ABR');
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

// FOR DUMMY TEST CASES
app.post(
  '/update-user',
  updateUserValidator,
  (req: UpdateUserRequest, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    res.status(200).json({ message: 'User updated successfully' });
  },
);

app.use((err: HttpError, req: Request, res: Response) => {
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        message: err.message,
        path: '',
        location: '',
      },
    ],
  });
});

export default app;
