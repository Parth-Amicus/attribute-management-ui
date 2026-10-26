
import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IAttribute } from '../../interface/attribute.interface';

@Component({
  selector: 'app-attribute-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './attribute-card.html',
  styleUrl: './attribute-card.css'
})
export class AttributeCardComponent {
  @Input({ required: true }) attribute!: IAttribute;
  // angular performs an assignment conceptually like this.attribute = attri
}
//@Input() allows a parent component to pass data to this component and required tells parent must pass this input
//! tells TypeScript that Angular will provide the value it doesn't assign a value itself