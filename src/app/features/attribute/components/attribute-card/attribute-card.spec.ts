import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeCardComponent } from './attribute-card';

describe('AttributeCard', () => {
  let component: AttributeCardComponent;
  let fixture: ComponentFixture<AttributeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
