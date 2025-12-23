import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, UploadFileMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtService } from '../../libs/rest/auth/jwt.service.js';
import { RequestWithUser } from '../../types/express-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout, middlewares: [new PrivateRouteMiddleware()] });

    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.configService, 'avatar'),
      ],
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateUserDto;
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as LoginUserDto;
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${email} not found.`,
        'UserController',
      );
    }

    const isValid = existsUser.verifyPassword(password, this.configService.get('SALT'));
    if (!isValid) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid password.',
        'UserController',
      );
    }

    const jwtService = new JwtService(this.configService.get('JWT_SECRET'), this.configService.get('JWT_EXPIRES_IN'));
    const token = await jwtService.sign({
      id: existsUser.id,
      email: existsUser.email,
      name: existsUser.name,
    });

    this.ok(res, { token });
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.noContent(res, { message: 'Logged out successfully' });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as RequestWithUser).user?.id;

    if (!currentUserId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Avatar file is required',
        'UserController'
      );
    }

    const avatarPicPath = `/upload/${file.filename}`;
    const updated = await this.userService.updateAvatar(currentUserId, avatarPicPath);

    this.ok(res, fillDTO(UserRdo, updated));
  }
}
