import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAttribute } from './edit-attribute';

describe('EditAttribute', () => {
  let component: EditAttribute;
  let fixture: ComponentFixture<EditAttribute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAttribute],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAttribute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
