import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { BaseController, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, DocumentExistsMiddleware, PrivateRouteMiddleware, Middleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { RequestWithUser } from '../../types/express-request.type.js';

class InjectAuthorIdMiddleware implements Middleware {
  public execute(req: Request, _res: Response, next: NextFunction): void {
    const authorId = (req as RequestWithUser).user?.id;
    req.body = { ...(req.body as Record<string, unknown>), authorId };
    next();
  }
}

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new PrivateRouteMiddleware(), new InjectAuthorIdMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites, middlewares: [new PrivateRouteMiddleware()] });

    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')]
    });

    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')]
    });

    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')]
    });

    this.addRoute({ path: '/favorites/:offerId', method: HttpMethod.Post, handler: this.addToFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
      ]
    });

    this.addRoute({ path: '/favorites/:offerId', method: HttpMethod.Delete, handler: this.deleteFromFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
      ]
    });
  }

  public async index(req: Request, res: Response) {
    const currentUserId = (req as RequestWithUser).user?.id;
    const offers = await this.offerService.find(currentUserId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateOfferDto;
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const body = req.body as UpdateOfferDto;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    await this.offerService.deleteById(offerId);
    this.noContent(res, {});
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params;
    const offers = await this.offerService.findPremiumByCity(city as City);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = (req as RequestWithUser).user?.id as string;
    const offers = await this.offerService.findFavourites(userId);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addToFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = (req as RequestWithUser).user?.id as string;
    const updated = await this.offerService.addToFavourites(offerId, userId);
    this.ok(res, fillDTO(OfferRdo, updated));
  }

  public async deleteFromFavorites(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = (req as RequestWithUser).user?.id as string;
    const updated = await this.offerService.deleteFromFavourites(offerId, userId);
    this.ok(res, fillDTO(OfferRdo, updated));
  }
}
