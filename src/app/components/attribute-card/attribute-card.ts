
import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
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

  //runs when angular initializes the component 
  ngOnInit(){
    console.log('[AttributeCard] ngOnInit', this.attribute.AttributeName);
  }

    // runs when the @Input property changes
  // It also runs initially when Angular first sets the input
  ngOnChanges(changes: SimpleChanges): void { //simplechanges is angular type that describes changes to components inout property 
    const attributeChange = changes['attribute'];  //changes is an object Angular provides that describes which input properties changed

    if (attributeChange) {
      console.log('[AttributeCard] ngOnChanges:',attributeChange.currentValue as IAttribute
      );
    }
  }
  // runs just before Angular destroys this component
  ngOnDestroy(): void {
    console.log(
      '[AttributeCard] ngOnDestroy:',
      this.attribute.AttributeName
    );
  }
}
//@Input() allows a parent component to pass data to this component and required tells parent must pass this input
//! tells TypeScript that Angular will provide the value it doesn't assign a value itself