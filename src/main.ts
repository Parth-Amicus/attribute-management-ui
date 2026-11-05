import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // contains global configurations 
import { App } from './app/app';

//bootstrap is an angular function that starts a standalone angular app
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//it returns a promise and catch is used to handle error 
