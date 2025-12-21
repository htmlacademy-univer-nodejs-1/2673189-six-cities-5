import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, DocumentExistsMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites });

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
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.find();
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

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavourites(_req.headers.authorization ?? '');
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
