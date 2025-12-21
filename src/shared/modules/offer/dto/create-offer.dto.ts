import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsLatitude,
  IsLongitude, IsMongoId, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';
import { Amenities, City, HousingType } from '../../../types/index.js';

export class CreateOfferDto {
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description: string;

  @IsString()
  public city: City;

  @IsString()
  public previewImage: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  public images: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  public isFavorite?: boolean;

  @IsString()
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
  @ArrayMaxSize(20)
  @IsString({ each: true })
  public amenities: Amenities[];

  @IsMongoId()
  public author: string;

  @IsInt()
  @Min(0)
  public commentsCnt: number;

  @IsNumber()
  @IsLatitude()
  public latitude: number;

  @IsNumber()
  @IsLongitude()
  public longitude: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  public rating: number;
}
