import { Response } from 'express';
import { RegisterUserRequest } from '../types';

import logger from '../config/logger';
import { UserService } from '../services/UserService';

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: RegisterUserRequest, res: Response) {
    logger.info('Registering user:', req.body);
    const { firstName, lastName, email, password } = req.body;

    this.userService
      .create({ firstName, lastName, email, password })
      .then((user) => {
        logger.info('User created:', user);
        res.status(201).json(user);
      });
  }
}
