import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude, IsMongoId,
  IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Amenities, City, HousingType } from '../../../types/index.js';
import { AMENITIES_VALUES, CITY_VALUES, HOUSING_VALUES } from '../../../const/index.js';

export class CreateOfferDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description: string;

  @IsEnum(CITY_VALUES)
  public city: City;

  @IsString()
  public previewImage: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsEnum(HOUSING_VALUES)
  public type: HousingType;

  @IsInt()
  @Min(1)
  @Max(8)
  public roomsCnt: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public peopleCnt: number;

  @IsInt()
  @Min(100)
  @Max(100000)
  public price: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(AMENITIES_VALUES, { each: true })
  public amenities: Amenities[];

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating: number;

  @IsNumber()
  @IsLatitude()
  public latitude: number;

  @IsNumber()
  @IsLongitude()
  public longitude: number;

  @IsMongoId()
  public authorId: string;
}
