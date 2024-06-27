import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Logger } from 'winston';
import { ROLES } from '../constants';
import bcrypt from 'bcrypt';

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
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    try {
      const user: UserData = await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashPassword,
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
