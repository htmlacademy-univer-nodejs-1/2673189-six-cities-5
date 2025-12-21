import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(
    private readonly paramName: string
  ) {}

  public execute(req: Parameters<Middleware['execute']>[0], _res: Parameters<Middleware['execute']>[1], next: Parameters<Middleware['execute']>[2]): void {
    const value = req.params[this.paramName];

    if (!value || !isValidObjectId(value)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Invalid ObjectId parameter: ${this.paramName}`,
        'ValidateObjectIdMiddleware'
      );
    }

    next();
  }
}
