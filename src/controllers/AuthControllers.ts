import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types';
import { JwtPayload, sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { ROLES } from '../constants';
import createHttpError from 'http-errors';
import { Config } from '../config';

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.info('New request for registering user:', {
      firstName,
      lastName,
      email,
      password: '*********',
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info('User has been registered:', user);

      let privateKey: Buffer;

      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, '../../certs/private.pem'),
        );
      } catch (err) {
        const error = createHttpError(
          500,
          'Fail to read private key. Make sure the private.pem file is present in the certs folder.',
        );

        next(error);
        return;
      }

      const payLoad: JwtPayload = {
        sub: user.id || 1,
        role: user.role || ROLES.CUSTOMER,
      };

      const accessToken = sign(payLoad, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      });

      const secret = Config.REFRESH_TOKEN_SECRET || 'secret';
      const refreshToken = sign(payLoad, secret, {
        algorithm: 'HS256',
        expiresIn: '1y',
        issuer: 'auth-service',
      });

      this.logger.info(accessToken);
      this.logger.info(refreshToken, {
        keyName: 'refreshToken',
      });

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // in milliseconds
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365, // in milliseconds
        httpOnly: true,
      });

      res.status(201).json(user);
    } catch (error) {
      next(error);
      return;
    }
  }
}
