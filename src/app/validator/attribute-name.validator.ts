
import { AbstractControl, ValidationErrors } from '@angular/forms';
// abstract control gives access to field value 
// validation error used for object containg validation error

export function attributeNameValidator(
  control: AbstractControl // received form control
): ValidationErrors | null {
  const value = String(control.value ?? '');

  if (value.trim().length === 0) {
    return { whitespace: true };
  }

  // allow letters number spaces hyphens only
  if (!/^[a-zA-Z0-9 -]+$/.test(value)) { // $ marks end of string
    return { invalidCharacters: true };
  }

  return null;
}
