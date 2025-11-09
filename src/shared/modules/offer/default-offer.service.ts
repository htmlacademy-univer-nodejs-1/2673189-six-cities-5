import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/city.type.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(createDto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(createDto);
    this.logger.info(`New offer created: ${createDto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['author']).exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .populate(['author'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId', 'categories'])
      .exec();
  }

  public async commentCntByOffer(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({city, isPremium: true}).populate(['author']).exec();
  }

  findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({favoritedBy: userId}).populate(['author']).exec();
  }

  addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $push: { favouritedBy: userId } },
      { new: true }
    )
      .populate(['author'])
      .exec();
  }

  async deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findByIdAndUpdate(
      offerId,
      { $pop: { favouritedBy: userId } },
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
            commentCount: {
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
            commentCount: 1,
            rating: {
              $round: [{ $ifNull: ['$averageRating', 0] }, 1]
            }
          }
        }
      ]);

      if (result.length > 0) {
        const { commentCnt, rating } = result[0];
        await this.offerModel.findByIdAndUpdate(
          offerId,
          {
            rating: rating,
            commentCnt: commentCnt
          }
        );
        console.log(`Updated rating for offer, id: ${offerId} with ${rating} and (${commentCnt} comments)`);
      } else {
        console.log(`Offer not found, id: ${offerId}`);
      }
    } catch (error) {
      console.error(`Error updating rating for offer, id: ${offerId}:`, error);
      throw error;
    }
  }
}
