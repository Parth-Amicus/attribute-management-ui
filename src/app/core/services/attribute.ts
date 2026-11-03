import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { IAttribute } from '../../interface/attribute.interface';
import { AttributeDTO } from '../../interface/attribute.dto';

import { MappingService } from './mapping';
import { environment } from '../../../environments/environment';

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
    private mappingService: MappingService
  ) { }

  // GET: Return all attributes from the API
  getAttributes(): Observable<IAttribute[]> {
    return this.http.get<AttributeDTO[]>(this.apiUrl).pipe(
      map(attributes =>
        attributes.map(attribute =>
          this.mappingService.toAttribute(attribute) //toAttribute converts thr api data into frontend 
        )
      )
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

    // Exclude ID so json-server can generate a new one.
    const { id, ...dto } = this.mappingService.toDTO(attribute);

    return this.http.post<AttributeDTO>(this.apiUrl, dto).pipe(
      map(response => this.mappingService.toAttribute(response))
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
  deleteAttribute(id: number|string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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