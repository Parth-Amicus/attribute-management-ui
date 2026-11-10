import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { EditAttributeComponent } from '../features/attribute/components/edit-attribute/edit-attribute';
import { unsavedChangesGuard } from './unsaved-changes-guard';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<EditAttributeComponent> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
