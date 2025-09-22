import { City } from './city.type';
import { HousingType } from './housing.type';
import { Amenities } from './amenities.type';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
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
