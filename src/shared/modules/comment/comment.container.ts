import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel, DefaultCommentService, CommentService } from './index.js';
import { Controller } from '../../libs/rest/index.js';
import CommentController from './comment.controller.js';

export const commentContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
    options.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
    options.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();
  });
