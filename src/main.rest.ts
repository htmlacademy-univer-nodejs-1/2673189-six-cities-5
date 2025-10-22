import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { restApplicationContainer } from './rest/rest.container.js';
import { userContainer } from './shared/modules/user/index.js';
import { offerContainer } from './shared/modules/offer/index.js';
import { commentContainer } from './shared/modules/comment/index.js';


async function bootstrap() {
  const appContainer = new Container();

  appContainer.load(
    restApplicationContainer,
    userContainer,
    offerContainer,
    commentContainer
  );
  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}


await bootstrap();
