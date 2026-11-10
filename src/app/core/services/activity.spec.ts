import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { ActivityService, IActivity } from './activity';
import { environment } from '../../../environments/environment';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(ActivityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads recent activity from JSON Server and stores new activity through its API', () => {
    const activityDate = '2026-11-10T12:00:00.000Z';

    const loadRequest = httpTestingController.expectOne(request =>
      request.url === `${environment.apiUrl}/activities`
    );
    expect(loadRequest.request.method).toBe('GET');
    expect(loadRequest.request.params.get('_page')).toBe('1');
    expect(loadRequest.request.params.get('_per_page')).toBe('10');
    expect(loadRequest.request.params.get('_sort')).toBe('-performedAt');
    loadRequest.flush({
      data: [{
        id: 'existing',
        action: 'Updated',
        attributeName: 'Employee Code',
        performedBy: 'Admin',
        performedAt: activityDate
      }]
    });

    let activities: IActivity[] = [];
    service.activities$.subscribe(value => activities = value);
    expect(activities[0].performedAt).toEqual(new Date(activityDate));

    service.addActivity('Created', 'Department', 'Admin');

    const saveRequest = httpTestingController.expectOne(request =>
      request.url === `${environment.apiUrl}/activities`
    );
    expect(saveRequest.request.method).toBe('POST');
    expect(saveRequest.request.body).toMatchObject({
      action: 'Created',
      attributeName: 'Department',
      performedBy: 'Admin'
    });
    expect(saveRequest.request.body.performedAt).toBeTruthy();

    saveRequest.flush({
      id: 'new',
      action: 'Created',
      attributeName: 'Department',
      performedBy: 'Admin',
      performedAt: '2026-11-10T12:30:00.000Z'
    });

    expect(activities[0].id).toBe('new');
    expect(activities[0].performedAt).toEqual(new Date('2026-11-10T12:30:00.000Z'));
    expect(activities).toHaveLength(2);
  });
});
