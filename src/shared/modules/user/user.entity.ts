import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '', trim: true, type: () => String })
  public name: string;

  @prop({ unique: true, required: true, trim: true, type: () => String })
  public email: string;

  @prop({ required: false, default: '', trim: true, type: () => String })
  public avatarPicPath?: string;

  @prop({ required: true, type: () => String })
  public password: string;

  @prop({ required: true, default: 'обычный', type: () => String })
  public type: UserType;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarPicPath = userData.avatarPicPath ;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string): boolean {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
