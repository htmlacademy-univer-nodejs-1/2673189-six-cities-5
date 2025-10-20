import { Amenities, City, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  images: string[];
  isPremium?: boolean;
  isFavorite?: boolean;
  rating?: number;
  type: HousingType;
  roomsCnt: number;
  peopleCnt: number;
  price: number;
  amenities: Amenities[];
  author: string;
  commentsCnt: number;
  latitude: number;
  longitude: number;
}
