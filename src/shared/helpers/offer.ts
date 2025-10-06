import {Amenities, City, HousingType, Offer} from '../types/index.js';

export function ParseOffer(data: string): Offer {
  const [
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
    author,
    commentsCnt,
    latitude,
    longitude
  ] = data.replace('\r\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as City,
    previewImage,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: type as HousingType,
    roomsCnt: parseInt(roomsCnt, 10),
    peopleCnt: parseInt(peopleCnt, 10),
    price: parseInt(price, 10),
    amenities: amenities.split(';') as Amenities[],
    author,
    commentsCnt: parseInt(commentsCnt, 10),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };
}
