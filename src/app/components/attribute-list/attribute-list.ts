
import { Component, OnInit } from '@angular/core';
//import { DatePipe } from '@angular/common';
import { AttributeService } from '../../services/attribute';
import { IAttribute } from '../../interface/attribute.interface';
import { AttributeCardComponent } from '../attribute-card/attribute-card';
import { ActiveStatusDirective } from '../../directives/active-status';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [AttributeCardComponent,ActiveStatusDirective,RelativeTimePipe],
  templateUrl: './attribute-list.html', // html gets access to attributes from here 
  styleUrl: './attribute-list.css'
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

  // the table is the default view
  viewMode: 'table' | 'card' = 'table';

  constructor(private attributeService: AttributeService) {} // provides service instance

  ngOnInit(): void {
    this.attributes = this.attributeService.getAttributes(); // using service instance and method 
  } // runs when coponents are initialized
 
  // change the presentation without reloading the data
  setView(mode: 'table' | 'card'): void {
    this.viewMode = mode;
  }
}
