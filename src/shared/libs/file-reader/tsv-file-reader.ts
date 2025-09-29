import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, City, Amenities, HousingType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, postDate, cityName, previewImage, images, isPremium, isFavorite, rating, type, roomsCnt, peopleCnt, price, amenities, author, commentsCnt, latitude, longitude]) => ({
        title,
        description,
        postDate: new Date(postDate),
        city: cityName as City,
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
        longitude: parseFloat(longitude),
      }));
  }
}
