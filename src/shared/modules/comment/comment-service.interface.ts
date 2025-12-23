import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  create(dto: CreateCommentDto & { offerId: string; author: string }): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}
