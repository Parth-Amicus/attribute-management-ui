
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AppStateStore } from '../../../core/services/app-state-store';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class LoaderComponent {

  // Observable that tells us whether an HTTP request is in progress
 

  constructor(private store: AppStateStore) {}
  get isLoading$() {
    return this.store.isLoading$;
  }
}
