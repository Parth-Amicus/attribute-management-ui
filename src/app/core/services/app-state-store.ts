import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs';
import { IAttribute } from '../../interface/attribute.interface';
import { IBusinessUnit } from '../../interface/business-unit.interface';
import { ICustomerLocation } from '../../interface/customer-location.interface';
import { ICompany } from '../../interface/company.interface';

// Defines the structure of lookup data.
export interface ILookupState {
    businessUnits: IBusinessUnit[];
    customerLocations: ICustomerLocation[];
    companies: ICompany[];
}

// Defines the complete application state.
export interface IAppState {
    attributes: IAttribute[];
    lookups: ILookupState;
    isLoading: boolean;
    isAuthenticated: boolean;
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
        isAuthenticated: false
    };

    // BehaviorSubject stores the latest application state
    private stateSubject = new BehaviorSubject<IAppState>(this.initialState);

    // Components can observe the state but cannot directly modify it
    state$ = this.stateSubject.asObservable();

    // Returns the current state
    get currentState(): IAppState {
        return this.stateSubject.value;
    }

    // Updates the application state
    private updateState(newState: Partial<IAppState>): void {
        this.stateSubject.next({
            ...this.currentState,
            ...newState
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

    // Individual observable state slices
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
}