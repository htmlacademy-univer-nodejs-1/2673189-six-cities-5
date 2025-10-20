import { City } from './city.type.js';
import { HousingType } from './housing.type.js';
import { Amenities } from './amenities.type.js';
import { User } from './user.type.js';

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
  author: User;
  commentsCnt: number;
  latitude: number;
  longitude: number;
}
