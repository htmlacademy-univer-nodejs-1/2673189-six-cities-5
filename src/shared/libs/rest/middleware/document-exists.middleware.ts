import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { DocumentExists } from './document-exists.interface.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly paramName: string,
    private readonly entityName: string = 'Document'
  ) {}

  public async execute(
    req: Parameters<Middleware['execute']>[0],
    _res: Parameters<Middleware['execute']>[1],
    next: Parameters<Middleware['execute']>[2]
  ): Promise<void> {
    const documentId = req.params[this.paramName];

    const exists = await this.service.exists(documentId);
    if (!exists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with id ${documentId} not found`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
