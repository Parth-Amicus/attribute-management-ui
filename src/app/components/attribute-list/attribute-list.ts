
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AttributeService } from '../../services/attribute';
import { IAttribute } from '../../interface/attribute.interface';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './attribute-list.html', // html gets access to attributes from here 
  styleUrl: './attribute-list.css'
})
export class AttributeListComponent implements OnInit {

  attributes: IAttribute[] = []; //array of type attribute interface to hold the displayed records

  constructor(private attributeService: AttributeService) {} // provides service instance

  ngOnInit(): void {
    this.attributes = this.attributeService.getAttributes(); // using service instance and method 
  } // runs when coponents are initialized
}
