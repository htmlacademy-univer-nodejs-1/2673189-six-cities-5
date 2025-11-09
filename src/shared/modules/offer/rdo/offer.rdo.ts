import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import {Amenities, City, HousingType} from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publicationDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: [string, string, string, string, string, string];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: HousingType;

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxGuests: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: Amenities;

  @Expose()
  public commentCount: number;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public author: UserRdo;
}
