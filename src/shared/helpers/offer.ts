import { Amenities, City, HousingType, Offer, UserType } from '../types/index.js';

export function ParseOffer(data: string): Offer {
  const [
    title,
    description,
    postDate,
    city,
    previewImage,
    imagesString,
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
    latitude,
    longitude
  ] = data.replace('\r\n', '').split('\t');

  return {
    title,
    description,
    postDate: new Date(postDate),
    city: city as City,
    previewImage,
    images: imagesString.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: type as HousingType,
    roomsCnt: parseInt(roomsCnt, 10),
    peopleCnt: parseInt(peopleCnt, 10),
    price: parseInt(price, 10),
    amenities: amenities.trim().split(';') as Amenities[],
    author: {
      name: authorName,
      email: authorEmail,
      avatarPicPath: authorAvatar,
      password: '',
      type: authorType as UserType
    },
    commentsCnt: parseInt(commentsCnt, 10),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude)
  };
}
