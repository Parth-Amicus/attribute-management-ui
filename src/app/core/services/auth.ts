import { Injectable } from '@angular/core';
import { AppStateStore } from './app-state-store';
import { IAuthUser } from '../../interface/auth-user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})  // tells that this class can participate in DI 
export class AuthService {

  constructor(private store: AppStateStore) { } // using constructor because authentication service dependa on another service 

  // Checks whether a user is logged in
  get isLoggedIn(): boolean {
    return this.store.currentState.isAuthenticated; 
  }

  // Returns the currently loggedin user
  get currentUser(): IAuthUser | null {
    return this.store.currentState.currentUser;
  }
  
  // Observable that provides updates whenever the current user changes
  get currentUser$(): Observable<IAuthUser | null> {
    return this.store.currentUser$;
  } // used in app.ts

  // Logs in the user and stores their information
  login(user: IAuthUser): void {
    this.store.setAuthenticated(true);
    this.store.setCurrentUser(user);
  }

  // Logs out the user and clears their information
  logout(): void {
    this.store.setAuthenticated(false);
    this.store.setCurrentUser(null);
  }
}