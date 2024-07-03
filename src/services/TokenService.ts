import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { Config } from '../config';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entity/RefreshToken';
import { User } from '../entity/User';

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}
  generateAccessToken(payLoad: JwtPayload) {
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

      throw error;
    }

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
}
