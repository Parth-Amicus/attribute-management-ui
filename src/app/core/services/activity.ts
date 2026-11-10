import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IActivity {
    id: number | string;
    action: 'Created' | 'Updated' | 'Deleted';
    attributeName: string;
    performedBy: string;
    performedAt: Date;
}

interface IActivityDTO extends Omit<IActivity, 'performedAt'> {
    performedAt: string;
}

interface IActivityPage {
    data: IActivityDTO[];
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
    private readonly apiUrl = `${environment.apiUrl}/activities`;
    private readonly isBrowser: boolean;
    private readonly activitiesSubject: BehaviorSubject<IActivity[]>;

    readonly activities$;

    constructor(
        private readonly http: HttpClient,
        @Inject(PLATFORM_ID) platformId: object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.activitiesSubject = new BehaviorSubject<IActivity[]>([]);
        this.activities$ = this.activitiesSubject.asObservable();

        if (this.isBrowser) {
            this.loadActivities();
        }
    }

    private loadActivities(): void {
        const params = new HttpParams()
            .set('_page', 1)
            .set('_per_page', 10)
            .set('_sort', '-performedAt');

        this.http.get<IActivityPage>(this.apiUrl, { params }).subscribe({
            next: response => {
                this.activitiesSubject.next(
                    response.data.map(activity => this.toActivity(activity))
                );
            },
            error: error => {
                console.error('Unable to load recent activities:', error);
            }
        });
    }

    addActivity(
        action: IActivity['action'],
        attributeName: string,
        performedBy: string
    ): void {
        if (!this.isBrowser) {
            return;
        }

        const activity = {
            action,
            attributeName,
            performedBy,
            performedAt: new Date().toISOString()
        };

        this.http.post<IActivityDTO>(this.apiUrl, activity).subscribe({
            next: savedActivity => {
                const updatedActivities = [
                    this.toActivity(savedActivity),
                    ...this.activitiesSubject.value.filter(
                        existing => existing.id !== savedActivity.id
                    )
                ]
                    .sort((left, right) =>
                        right.performedAt.getTime() - left.performedAt.getTime()
                    )
                    .slice(0, 10);

                this.activitiesSubject.next(updatedActivities);
            },
            error: error => {
                console.error('Unable to save recent activity:', error);
            }
        });
    }

    private toActivity(activity: IActivityDTO): IActivity {
        return {
            ...activity,
            performedAt: new Date(activity.performedAt)
        };
    }
}