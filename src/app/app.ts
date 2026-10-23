import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AttributeListComponent } from './components/attribute-list/attribute-list';

@Component({
  imports: [RouterOutlet, AttributeListComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  protected readonly title = signal('attribute-management-ui');
}
