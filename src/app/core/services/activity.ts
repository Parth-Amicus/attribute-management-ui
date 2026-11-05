import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IActivity {
    id: number;
    action: 'Created' | 'Updated' | 'Deleted';
    attributeName: string;
    performedBy: string;
    performedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
    private readonly storageKey = 'recent-activities';
    private readonly isBrowser: boolean;
    private readonly activitiesSubject: BehaviorSubject<IActivity[]>;

    activities$;

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.activitiesSubject = new BehaviorSubject<IActivity[]>(this.loadActivities());
        this.activities$ = this.activitiesSubject.asObservable();
    }

    private loadActivities(): IActivity[] {
        if (!this.isBrowser) return [];

        const saved = localStorage.getItem(this.storageKey);
        if (!saved) return [];

        try {
            return (JSON.parse(saved) as IActivity[]).map(activity => ({
                ...activity,
                performedAt: new Date(activity.performedAt)
            }));
        } catch (error) {
            console.error('Unable to load recent activities:', error);
            return [];
        }
    }

    addActivity(
        action: IActivity['action'],
        attributeName: string,
        performedBy: string
    ): void {
        const updatedActivities = [
            {
                id: Date.now(),
                action,
                attributeName,
                performedBy,
                performedAt: new Date()
            },
            ...this.activitiesSubject.value
        ].slice(0, 10);

        this.activitiesSubject.next(updatedActivities);

        if (this.isBrowser) {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(updatedActivities));
            } catch (error) {
                console.error('Unable to save recent activities:', error);
            }
        }
    }
}