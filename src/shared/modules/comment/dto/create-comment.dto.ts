import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  public text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  public rating: number;

  @IsMongoId()
  public offerId: string;

  @IsMongoId()
  public userId: string;
}
