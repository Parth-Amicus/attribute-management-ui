
import { Injectable } from '@angular/core';
import { AppStateStore } from './app-state-store';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private store: AppStateStore) {}

  get isLoggedIn(): boolean {
    return this.store.currentState.isAuthenticated;
  }

  login(): void {
    this.store.setAuthenticated(true);
  }

  logout(): void {
    this.store.setAuthenticated(false);
  }
}
