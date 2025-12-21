import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

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
  @Transform(({ obj }) => obj.userId?._id?.toString() ?? obj.userId?.toString())
  public userId: string;

  @Expose()
  public createdAt: Date;
}
