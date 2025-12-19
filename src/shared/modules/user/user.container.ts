import { types } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import {ContainerModule, ContainerModuleLoadOptions} from 'inversify';
import {UserController} from './user.controller.js';
import {Controller} from '../../libs/rest';


export const userContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    options.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
    options.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  });
