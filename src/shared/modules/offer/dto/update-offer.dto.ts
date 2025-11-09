import {Amenities, HousingType} from '../../../types';

export class UpdateOfferDto {
  title: string;
  description: string;
  previewImage: string;
  images: string[];
  isPremium?: boolean;
  isFavorite?: boolean;
  type: HousingType;
  roomsCnt: number;
  peopleCnt: number;
  price: number;
  amenities: Amenities[];
}
