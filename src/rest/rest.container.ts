import { ContainerModule, ContainerModuleLoadOptions} from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/db-client/index.js';

export const restApplicationContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {

    options.bind<RestApplication>(Component.RestApplication).toSelf().inSingletonScope();
    options.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
    options.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
    options.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  });
