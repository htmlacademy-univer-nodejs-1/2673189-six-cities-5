import { UserType } from './user-type.type';

export type User = {
  name: string;
  email: string;
  avatarPicPath?: string;
  password: string;
  type: UserType;
}
