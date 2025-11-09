import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel, DefaultCommentService, CommentService } from './index.js';

export const commentContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
    options.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  });
