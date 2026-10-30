import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet], //route outlet so that app.html can use
  selector: 'app-root', //It tells Angular that this component should be rendered wherever it finds the <app-root> element
  styleUrl: './app.css',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  protected readonly title = signal('attribute-management-ui');
}
