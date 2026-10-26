import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeListComponent } from './attribute-list';

describe('AttributeList', () => {
  let component: AttributeListComponent;
  let fixture: ComponentFixture<AttributeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
