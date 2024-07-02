import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError, { HttpError } from 'http-errors';
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
  }: UserData): Promise<UserData | HttpError<number>> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      const error = createHttpError(400, 'Email already exists');
      throw error;
    }

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

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
