import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/city.type.js';
import { CommentService } from '../comment/comment-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {}

  public async create(createDto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const { authorId, ...rest } = createDto as unknown as CreateOfferDto & { authorId: string };

    const result = await this.offerModel.create({
      ...rest,
      author: authorId,
    });

    this.logger.info(`New offer created: ${createDto.title}`);

    return result.populate(['author']);
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['author']).exec();
  }

  public async findByIdWithUser(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).populate(['author']).exec();
    if (!offer || !userId) {
      return offer;
    }

    const favouritedBy = offer.favouritedBy as unknown as Array<{ _id?: unknown } | string>;
    const isFavorite = Array.isArray(favouritedBy)
      ? favouritedBy.some((u) => String(u) === userId || String((u && (u as { _id?: unknown })._id) ?? '') === userId)
      : false;

    (offer as unknown as Record<string, unknown>)['isFavorite'] = isFavorite;
    return offer;
  }

  public async isOwner(offerId: string, userId: string): Promise<boolean> {
    const offer = await this.offerModel.findById(offerId, { author: 1 }).lean().exec();
    if (!offer) {
      return false;
    }

    const author = (offer as unknown as { author?: unknown }).author;
    return String(author) === userId;
  }

  public async find(currentUserId?: string, limit = 60): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.offerModel
      .find()
      .sort({ postDate: -1 })
      .limit(limit)
      .populate(['author'])
      .exec();

    if (!currentUserId) {
      return offers;
    }

    return offers.map((offer) => {
      const favouritedBy = offer.favouritedBy as unknown as Array<{ _id?: unknown } | string>;

      const isFavorite = Array.isArray(favouritedBy)
        ? favouritedBy.some((u) => String(u) === currentUserId || String((u && (u as { _id?: unknown })._id) ?? '') === currentUserId)
        : false;

      (offer as unknown as Record<string, unknown>)['isFavorite'] = isFavorite;
      return offer;
    });
  }

  public async deleteById(offerId: string, cascade = false): Promise<DocumentType<OfferEntity> | null> {
    if (cascade) {
      await this.commentService.deleteByOfferId(offerId);
    }

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author'])
      .exec();
  }

  public async commentCntByOffer(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $inc: { commentsCnt: 1 } },
        { new: true }
      )
      .exec();
  }

  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ postDate: -1 })
      .limit(3)
      .populate(['author'])
      .exec();
  }

  findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ favouritedBy: userId }).populate(['author']).exec();
  }

  addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $addToSet: { favouritedBy: userId } },
      { new: true }
    )
      .populate(['author'])
      .exec();
  }

  async deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $pull: { favouritedBy: userId } },
      { new: true }
    )
      .populate(['author'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  async calculateRating(offerId: string): Promise<void> {
    try {
      const result = await this.offerModel.aggregate([
        {
          $match: { _id: offerId }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments'
          }
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            averageRating: {
              $avg: '$comments.rating'
            },
            commentsCnt: {
              $sum: {
                $cond: [{ $ifNull: ['$comments', false] }, 1, 0]
              }
            },
          }
        },
        {
          $project: {
            averageRating: {
              $ifNull: ['$averageRating', 0]
            },
            commentsCnt: 1,
            rating: {
              $round: [{ $ifNull: ['$averageRating', 0] }, 1]
            }
          }
        }
      ]);

      if (result.length > 0) {
        const { commentsCnt, rating } = result[0] as { commentsCnt: number; rating: number };
        await this.offerModel.findByIdAndUpdate(
          offerId,
          {
            rating,
            commentsCnt
          }
        );
        this.logger.info(`Updated rating for offer, id: ${offerId} with ${rating} and (${commentsCnt} comments)`);
      } else {
        this.logger.warning(`Offer not found, id: ${offerId}`);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Error updating rating for offer, id: ${offerId}:`, err);
      throw err;
    }
  }
}
