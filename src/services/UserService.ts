import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { ROLES } from '../constants';

export class UserService {
  constructor(
    private userRepository: Repository<User>,
    private logger: Logger,
  ) {}
  async create({
    firstName,
    lastName,
    email,
    password,
  }: UserData): Promise<UserData> {
    try {
      const user: UserData = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: ROLES.CUSTOMER,
      });

      this.logger.info('....', user);
      return user;
    } catch (error) {
      const errorCustom = createHttpError(500, 'Fail to create user');
      throw errorCustom;
    }
  }
}
