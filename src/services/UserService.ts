import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import logger from '../config/logger';

export class UserService {
  constructor(private userRepository: Repository<User>) {}
  async create({
    firstName,
    lastName,
    email,
    password,
  }: UserData): Promise<UserData> {
    const user = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });

    logger.info(user);
    return user;
  }
}
