import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './core/services/auth';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            currentUser$: of({ username: 'Admin', role: 'Admin' }),
            logout: () => undefined
          }
        }
      ]
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shows authenticated navigation links in the application header', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const navigationLinks = Array.from(
      compiled.querySelectorAll('.app-navigation a')
    ) as HTMLAnchorElement[];

    expect(navigationLinks.map(link => link.textContent?.trim())).toEqual([
      'Dashboard',
      'Attribute List'
    ]);
    expect(navigationLinks.map(link => link.getAttribute('href'))).toEqual([
      '/dashboard',
      '/attributes'
    ]);
  });
});
 