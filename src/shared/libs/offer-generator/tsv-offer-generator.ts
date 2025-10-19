import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { Location, MockServerData } from '../../types/index.js';

import {
  generateRandomBoolean,
  generateRandomValue,
  getRandomItem,
  getRandomItems
} from '../../helpers/common.js';
import {
  MIN_RATING,
  MAX_RATING,
  MIN_ROOMSCNT,
  MAX_ROOMSCNT,
  MIN_PEOPLECNT,
  MAX_PEOPLECNT,
  MIN_PRICE,
  MAX_PRICE,
  MIN_COMMENTS,
  MAX_COMMENTS,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  USER_TYPES
} from '../../const/offer.const.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles).toString();
    const description = getRandomItem<string>(this.mockData.descriptions).toString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.images).toString();
    const imageCount = generateRandomValue(3, 6);
    const images = Array.from(
      { length: imageCount },
      () => getRandomItem<string>(this.mockData.images)
    ).join(';');
    const isPremium = generateRandomBoolean().toString();
    const isFavorite = generateRandomBoolean().toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const type = getRandomItem(this.mockData.types).toString();
    const roomsCnt = generateRandomValue(MIN_ROOMSCNT, MAX_ROOMSCNT).toString();
    const peopleCnt = generateRandomValue(MIN_PEOPLECNT, MAX_PEOPLECNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems(this.mockData.amenities).join(';');
    const authorName = getRandomItem<string>(this.mockData.userNames);
    const authorEmail = getRandomItem<string>(this.mockData.emails).toString();
    const authorAvatar = getRandomItem<string>(this.mockData.images).toString();
    const authorType = getRandomItem([...USER_TYPES]).toString();
    const commentsCnt = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const coordinates = getRandomItem<Location>(this.mockData.locations);

    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      roomsCnt,
      peopleCnt,
      price,
      amenities,
      authorName,
      authorEmail,
      authorAvatar,
      authorType,
      commentsCnt,
      coordinates.latitude,
      coordinates.longitude
    ].join('\t');
  }
}
