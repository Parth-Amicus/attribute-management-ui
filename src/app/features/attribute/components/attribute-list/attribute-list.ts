
import { Component, OnInit } from '@angular/core';
import { AttributeService } from '../../../../core/services/attribute';
import { IAttribute } from '../../../../interface/attribute.interface';
import { AttributeCardComponent } from '../attribute-card/attribute-card';
import { ActiveStatusDirective } from '../../../../shared/directives/active-status';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time-pipe';
import { FormsModule } from '@angular/forms';
import { FilterByDirective } from '../../../../shared/directives/filter-by';
import { RouterLink } from '@angular/router'; //lets user to navigate to different url - used in html
@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [RouterLink,FormsModule,FilterByDirective,AttributeCardComponent,ActiveStatusDirective,RelativeTimePipe],
  templateUrl: './attribute-list.html', // html gets access to attributes from here 
  styleUrl: './attribute-list.css'
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

  // the table is the default view
  viewMode: 'table' | 'card' = 'table';

    // search term stays in the parent when the view changes
  searchTerm = '';

  constructor(private attributeService: AttributeService) {} // provides service instance

  ngOnInit(): void {
    this.attributes = this.attributeService.getAttributes(); // using service instance and method 
  } // runs when coponents are initialized
 
  // change the presentation without reloading the data
  setView(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }
}
