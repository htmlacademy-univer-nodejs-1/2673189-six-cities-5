import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/city.type.js';

export interface OfferService {
  create(createDto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  commentCntByOffer(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  calculateRating(offerId: string): Promise<void>;
}
