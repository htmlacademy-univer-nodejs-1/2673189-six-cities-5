import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude,
  IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Amenities, HousingType, City } from '../../../types/index.js';
import { AMENITIES_VALUES, CITY_VALUES, HOUSING_VALUES } from '../../../const/index.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1024)
  public description?: string;

  @IsOptional()
  @IsEnum(CITY_VALUES)
  public city?: City;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HOUSING_VALUES)
  public type?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  public roomsCnt?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  public peopleCnt?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(AMENITIES_VALUES, { each: true })
  public amenities?: Amenities[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsNumber()
  @IsLatitude()
  public latitude?: number;

  @IsOptional()
  @IsNumber()
  @IsLongitude()
  public longitude?: number;
}
