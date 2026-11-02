import { TestBed } from '@angular/core/testing';
import { Mapping } from './mapping';

describe('Mapping', () => {
  let service: Mapping;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mapping);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
