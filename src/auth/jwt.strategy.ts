import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { getTokenFromCookie } from 'src/misc/helper';

/**
 * Used for protecting endpoints by requiring a valid JWT be present on the request
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]), // Extracting Token from Request. Cookie extraction is possible too.
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   *
   * @param param0 cookie of the Request
   * @returns token if it is set within a cookie or null if not
   */
  private static extractFromCookie(req: RequestType): string | null {
    const { cookies } = req;
    const { cookie } = req.headers;
    if (cookies && 'token' in cookies && cookies.token.length === 0) {
      return cookies.token;
    }
    if (!cookie || cookie.length === 0) return null;
    return getTokenFromCookie(cookie);
  }

  async validate(payload: any) {
    return { name: payload.name };
  }
}
