import { UserType } from '../../../types/index.js';
import { IsEmail, IsOptional, IsString, IsEnum, MaxLength, MinLength } from 'class-validator';
import { USER_TYPES } from '../../../const/index.js';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(15)
  public name: string;

  @IsOptional()
  @IsString()
  public avatarPicPath?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  public password: string;

  @IsEnum(USER_TYPES)
  @IsOptional()
  public type!: UserType;
}

