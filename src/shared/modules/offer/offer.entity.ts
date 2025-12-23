import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Amenities, City, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, type: () => String })
  public title!: string;

  @prop({ trim: true, type: () => String })
  public description!: string;

  @prop({ required: true, default: Date.now, type: () => Date })
  public postDate!: string;

  @prop({ required: true, type: () => String })
  public city: City;

  @prop({ required: true, type: () => String })
  public previewImage: string;

  @prop({ required: true, type: () => [String] })
  public images: string[];

  @prop({ default: false, type: () => Boolean })
  public isPremium: boolean;

  @prop({
    ref: UserEntity,
    default: [],
  })
  public favouritedBy: Ref<UserEntity>[];

  @prop({ default: 0, type: () => Number })
  public rating: number;

  @prop({
    type: () => String,
  })
  public type!: HousingType;

  @prop({ required: true, type: () => Number })
  public roomsCnt: number;

  @prop({ required: true, type: () => Number })
  public peopleCnt: number;

  @prop({ required: true, type: () => Number })
  public price!: number;

  @prop({ default: [], type: () => [String] })
  public amenities: Amenities[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;

  @prop({ default: 0, type: () => Number })
  public commentsCnt!: number;

  @prop({ required: true, type: () => Number })
  public latitude: number;

  @prop({ required: true, type: () => Number })
  public longitude: number;
}

export const OfferModel = getModelForClass(OfferEntity);
