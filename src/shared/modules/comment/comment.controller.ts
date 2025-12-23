import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { BaseController, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, DocumentExistsMiddleware, PrivateRouteMiddleware, Middleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { RequestWithUser } from '../../types/express-request.type.js';

class InjectAuthorIdMiddleware implements Middleware {
  public execute(req: Request, _res: Response, next: NextFunction): void {
    const author = (req as RequestWithUser).user?.id;
    req.body = { ...(req.body as Record<string, unknown>), author };
    next();
  }
}

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new InjectAuthorIdMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
      ],
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const body = req.body as CreateCommentDto & { author: string };

    const created = await this.commentService.create({
      ...body,
      offerId,
    });

    this.created(res, fillDTO(CommentRdo, created));
  }
}
