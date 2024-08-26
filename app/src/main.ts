import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { registerLocaleData } from '@angular/common';
import localeEsHn from '@angular/common/locales/es-HN';
import localeEsHnExtra from '@angular/common/locales/extra/es-HN';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeEsHn, 'es-HN', localeEsHnExtra);

const appConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-HN' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync()
  ],
};

bootstrapApplication(AppComponent, appConfig);
