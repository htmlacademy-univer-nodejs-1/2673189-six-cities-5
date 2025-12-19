import {OfferService} from './offer-service.interface.js';
import {Component} from '../../types/index.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {types} from '@typegoose/typegoose';
import {DefaultOfferService} from './default-offer.service.js';
import {ContainerModule, ContainerModuleLoadOptions} from 'inversify';
import {Controller} from '../../libs/rest';
import OfferController from './offer.controller.js';

export const offerContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
    options.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
    options.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
  });
