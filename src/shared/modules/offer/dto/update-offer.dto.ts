import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';
import { Amenities, HousingType } from '../../../types/index.js';

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
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @IsString()
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
  @IsString({ each: true })
  public amenities?: Amenities[];
}
