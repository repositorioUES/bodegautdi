import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './core/custom-paginator';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor])),

    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
};
