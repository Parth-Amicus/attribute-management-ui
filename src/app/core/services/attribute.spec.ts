import { TestBed } from '@angular/core/testing';
import { AttributeService as Attribute } from './attribute';

describe('Attribute', () => {
  let service: Attribute;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Attribute);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
