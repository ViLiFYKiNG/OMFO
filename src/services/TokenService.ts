import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Config } from '../config';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
  generateAccessToken(payLoad: JwtPayload) {
    if (!Config.PRIVATE_KEY) {
      throw createHttpError(500, 'SECRET_KEY is not set..!');
    }

    const privateKey = Config.PRIVATE_KEY || 'PRIVATE_KEY';

    const accessToken = sign(payLoad, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    });

    return accessToken;
  }

  generateRefreshToken(payLoad: JwtPayload) {
    const secret = Config.REFRESH_TOKEN_SECRET || 'secret';
    const refreshToken = sign(payLoad, secret, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'auth-service',
      jwtid: String(payLoad.id),
    });

    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 24 * 60 * 60 * 365;

    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });

    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId: number) {
    await this.refreshTokenRepository.delete(tokenId);
  }

  async getAllTokens(userId: number) {
    return await this.refreshTokenRepository.find({
      where: { user: { id: userId } },
    });
  }
}
