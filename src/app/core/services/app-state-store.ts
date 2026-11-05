import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs';
import { IAttribute } from '../../interface/attribute.interface';
import { IBusinessUnit } from '../../interface/business-unit.interface';
import { ICustomerLocation } from '../../interface/customer-location.interface';
import { ICompany } from '../../interface/company.interface';
import { IAuthUser } from '../../interface/auth-user.interface';

// Defines the structure of lookup data
export interface ILookupState {
    businessUnits: IBusinessUnit[];
    customerLocations: ICustomerLocation[];
    companies: ICompany[];
}

// Defines the complete application state
export interface IAppState {
    attributes: IAttribute[];
    lookups: ILookupState;
    isLoading: boolean;
    isAuthenticated: boolean;
    currentUser: IAuthUser | null; //Interface IAuth represnets the current logged in user information
}

@Injectable({
    providedIn: 'root'
})
export class AppStateStore {

    // Initial state of the application
    private initialState: IAppState = {
        attributes: [],

        lookups: {
            businessUnits: [],
            customerLocations: [],
            companies: []
        },

        isLoading: false,
        isAuthenticated: false,
        currentUser: null
    };

    // BehaviorSubject stores the latest application state
     
    // subject is the object that sends data to subscribers
    // a behavior subject is a type of subject that requires an initial value and emits its current value to new subscribers
    private stateSubject = new BehaviorSubject<IAppState>(this.initialState);

    // Components can observe the state but cannot directly modify it - sent as observable 
    state$ = this.stateSubject.asObservable();

    // Returns the current state
    get currentState(): IAppState {
        return this.stateSubject.value;
    }

    // Updates the application state
    // partial is used because what if we dont want to update all the properties 
    private updateState(newState: Partial<IAppState>): void {
        this.stateSubject.next({
            ...this.currentState, // copies all existing properties
            ...newState //copies all properties you want to update into the same new object
        });
    }

    // Updates attributes
    setAttributes(attributes: IAttribute[]): void {
        this.updateState({ attributes });
    }

    // Updates lookup data
    setLookups(lookups: ILookupState): void {
        this.updateState({ lookups });
    }

    // Updates loading status
    setLoading(isLoading: boolean): void {
        this.updateState({ isLoading });
    }

    // Updates authentication status
    setAuthenticated(isAuthenticated: boolean): void {
        this.updateState({ isAuthenticated });
    }

    // Updates the currently logged-in user
    setCurrentUser(currentUser: IAuthUser | null): void {
        this.updateState({ currentUser });
    } // allows app to store current user 



    // Individual observable state slices
    // distinct until changed ensures that subscribers are only notified when the specific slice of state changes
    attributes$ = this.state$.pipe(
        map(state => state.attributes),
        distinctUntilChanged()
    );

    lookups$ = this.state$.pipe(
        map(state => state.lookups),
        distinctUntilChanged()
    );

    isLoading$ = this.state$.pipe(
        map(state => state.isLoading),
        distinctUntilChanged()
    );

    isAuthenticated$ = this.state$.pipe(
        map(state => state.isAuthenticated),
        distinctUntilChanged()
    );
    currentUser$ = this.state$.pipe(
        map(state => state.currentUser),
        distinctUntilChanged()
    ); // allows components to subscribe to changes in the current user state
}