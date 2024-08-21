import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { provideRouter } from '@angular/router';
import { YaConfig, AngularYandexMapsModule } from 'angular8-yandex-maps';

import { routes } from './app.routes';

import { environment } from "../environment/environment.dev";

const mapConfig: YaConfig = {
  apikey: environment.ymapAPIKey,
  lang: 'ru_RU',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(TuiRootModule),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig)),
  ]
};
