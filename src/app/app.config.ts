import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './core/interceptors/http.interceptor';

// provides functionality that app needs globally
// ApplicationConfig is angular type 
export const appConfig: ApplicationConfig = {
  providers: [ //provider tells angular how to create a dependency it is used for dependency injection
    provideBrowserGlobalErrorListeners(), // used for listening error globally (throw new Error())
    provideRouter(routes), //configures the router
    provideClientHydration(), // hydration allows angular to reuse the server-rendered HTML on the client side without having to re-render it, improving performance and user experience
    provideHttpClient(
      withInterceptors([httpInterceptor]) // interceptors allows to intercept outgoing http req and incoming responses 
    )
  ]
};
