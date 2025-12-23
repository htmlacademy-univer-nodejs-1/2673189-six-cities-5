import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { JwtService } from '../auth/jwt.service.js';
import { RequestWithUser } from '../../../types/express-request.type.js';

export class AuthenticateMiddleware implements Middleware {
  constructor(private readonly jwtService: JwtService) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return next();
    }

    try {
      const payload = await this.jwtService.verify(token);
      (req as RequestWithUser).user = { id: payload.id, email: payload.email };
      return next();
    } catch {
      return next();
    }
  }
}

export class PrivateRouteMiddleware implements Middleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if ((req as RequestWithUser).user?.id) {
      return next();
    }

    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  }
}
