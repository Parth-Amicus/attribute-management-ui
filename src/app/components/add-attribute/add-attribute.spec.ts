import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAttributeComponent } from './add-attribute';

describe('AddAttribute', () => {
  let component: AddAttributeComponent;
  let fixture: ComponentFixture<AddAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAttributeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAttributeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
