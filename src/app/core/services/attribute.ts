import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

import { IAttribute } from '../../interface/attribute.interface';
import { AttributeDTO } from '../../interface/attribute.dto';

import { MappingService } from './mapping';
import { environment } from '../../../environments/environment';
import { AppStateStore } from './app-state-store';
@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  /*
   * Provider scope:
   * providedIn: 'root' makes one shared service instance available
   * throughout the application
   *
   * If we provide this service in a component's providers array,
   * that component and its children use a separate service instance.
   * This can be useful when a component needs isolated data or state.
   * For this application, root-level sharing is appropriate because
   * the List, Add, and Edit components need to access the same data.
   */

  // Angular creates exactly one shared instance (a Singleton) of AttributeService for the entire app.
  // No matter how many components request this service, they all talk to the same execution block.

  // API endpoint for attributes. The base URL comes from environment.ts.
  private apiUrl = `${environment.apiUrl}/attributes`;

  constructor(
    private http: HttpClient,
    private mappingService: MappingService,
    private store: AppStateStore
  ) { }

  // GET: Return all attributes from the API
getAttributes(): Observable<IAttribute[]> {

  return this.http.get<AttributeDTO[]>(this.apiUrl).pipe(

    map(attributes =>
      attributes.map(attribute =>
        this.mappingService.toAttribute(attribute)
      )
    ),

    map(attributes => {
      this.store.setAttributes(attributes);
      return attributes;
    })

  );
}

  // GET: Find one attribute by its ID
  getAttributeById(id: number| string): Observable<IAttribute> {
    return this.http.get<AttributeDTO>(`${this.apiUrl}/${id}`).pipe(
      map(attribute => this.mappingService.toAttribute(attribute))
    );
  }

  // POST: Add a new attribute
addAttribute(attribute: IAttribute): Observable<IAttribute> {

  return this.http.get<AttributeDTO[]>(this.apiUrl).pipe(

    map(attributes => {
      const numericIds = attributes
        .map(item => Number(item.id))
        .filter(id => Number.isInteger(id) && id > 0);

      const latestId = Math.max(0, ...numericIds);

      return latestId + 1;
    }),

    switchMap(nextId => {
      const dto = this.mappingService.toDTO(attribute);
      dto.id = nextId;

      return this.http.post<AttributeDTO>(this.apiUrl, dto);
    }),

    map(response => this.mappingService.toAttribute(response)),

    map(newAttribute => {
      this.store.setAttributes([
        ...this.store.currentState.attributes,
        newAttribute
      ]);

      return newAttribute;
    })

  );
}

  // PUT: Replace an existing attribute with its edited version
  updateAttribute(updatedAttribute: IAttribute): Observable<IAttribute> {
    const dto = this.mappingService.toDTO(updatedAttribute);

    return this.http.put<AttributeDTO>(
      `${this.apiUrl}/${updatedAttribute.AttributeId}`,
      dto
    ).pipe(
      map(response => this.mappingService.toAttribute(response))
    );
  }

  // DELETE: Remove an attribute by its ID
deleteAttribute(id: number | string): Observable<void> {

  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(

    map(() => {

      const updatedAttributes =
        this.store.currentState.attributes.filter(
          attribute => attribute.AttributeId !== id
        );

      this.store.setAttributes(updatedAttributes);

    })

  );
}

  searchAttributes(searchTerm: string): Observable<IAttribute[]> {
    const term = searchTerm.trim();
    if (!term) {
      return this.getAttributes();
    }

    const params = new HttpParams().set('attribute_name:contains', term);

    return this.http.get<AttributeDTO[]>(this.apiUrl, { params }).pipe(
      map(attributes =>
        attributes.map(attribute =>
          this.mappingService.toAttribute(attribute)
        )
      )
    );
  }//The inner map() loops through every DTO in the array and converts it into an IAttribute whereas the outer map() wraps the entire array of converted IAttributes into an Observable that can be subscribed to by the component
} 