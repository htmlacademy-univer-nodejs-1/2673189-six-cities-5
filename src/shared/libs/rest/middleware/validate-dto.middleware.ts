import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

type ClassConstructor<T> = { new (...args: unknown[]): T };

export class ValidateDtoMiddleware<T extends object> implements Middleware {
  constructor(
    private readonly dtoClass: ClassConstructor<T>
  ) {}

  public execute(req: Parameters<Middleware['execute']>[0], _res: Parameters<Middleware['execute']>[1], next: Parameters<Middleware['execute']>[2]): void {
    const dtoInstance = plainToInstance(this.dtoClass, req.body);

    const errors = validateSync(dtoInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const message = errors
        .map((e) => e.toString())
        .join('; ');

      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Validation error: ${message}`,
        'ValidateDtoMiddleware'
      );
    }

    next();
  }
}
