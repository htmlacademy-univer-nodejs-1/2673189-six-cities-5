import { Expose, Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => (obj._id as Types.ObjectId).toString())
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  @Transform(({ obj }) => obj.offerId.toString())
  public offerId: string;

  @Expose()
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public createdAt: Date;
}
