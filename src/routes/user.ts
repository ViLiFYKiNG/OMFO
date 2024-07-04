import express, { NextFunction, RequestHandler, Response } from 'express';
import { UserController } from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { ROLES } from '../constants';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import logger from '../config/logger';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import createUserValidator from '../validators/create-user-validator';

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository, logger);
const userController = new UserController(userService, logger);

router.post(
  '/',
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]),
  createUserValidator,
  (req: CreateUserRequest, res: Response, next: NextFunction) =>
    userController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
  '/:id',
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]),
  createUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next) as unknown as RequestHandler,
);

// router.get(
//   '/',
//   authenticate as RequestHandler,
//   canAccess([ROLES.ADMIN]),
//   listUsersValidator,
//   (req: Request, res: Response, next: NextFunction) =>
//     userController.getAll(req, res, next) as unknown as RequestHandler,
// );

router.get(
  '/:id',
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]),
  (req, res, next) =>
    userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
  '/:id',
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]),
  (req, res, next) =>
    userController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
