// directive is an instruction to html to change its appearance and behaviour
// this is a attribute directive used to change element's appearance and behaviour dynamically

import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { IAttribute } from '../../interface/attribute.interface';
import { UserRole } from '../../interface/user-role';

@Directive({
  selector: '[appActiveStatus]', //angular will recognixe the directive when html uses appActiveStatus
  standalone: true
})
export class ActiveStatusDirective implements OnChanges {

  @Input({ required: true }) appActiveStatus!: IAttribute | UserRole;

  constructor(
    private elementRef: ElementRef<HTMLElement>, //give access to html element
    private renderer: Renderer2 // provides method to change the elements style
  ) { }

  ngOnChanges(changes: SimpleChanges): void { // simplechange is like a cghange report 
    if (changes['appActiveStatus'] && this.appActiveStatus) { // first appActiveStatus check if this property is changed (present in change report) and 2nd one check if this property is present (not null or undefined)
      this.updateStatus();
    }
  } //called when sets ip for first time and when i/p changes 

  private updateStatus(): void {
    let backgroundColor: string;
    let textColor: string;
    let tooltip: string;

    if (typeof this.appActiveStatus === 'string') {
      const isAdmin = this.appActiveStatus === 'Admin';
      backgroundColor = isAdmin ? '#dcfce7' : '#dbeafe';
      textColor = isAdmin ? '#166534' : '#1e40af';
      tooltip = `Role: ${this.appActiveStatus}`;
    } else {
      const isActive = this.appActiveStatus.IsActive;
      backgroundColor = isActive ? '#dcfce7' : '#fee2e2';
      textColor = isActive ? '#166534' : '#991b1b';
      const relevantDate = isActive ? this.appActiveStatus.CreatedOn : this.appActiveStatus.UpdatedOn;
      tooltip = `${isActive ? 'Active' : 'Inactive'} since ${relevantDate.toLocaleDateString()}`;
    }

    const element = this.elementRef.nativeElement; //if the directive is attached to a span the element refers to the same 

    this.renderer.setStyle(element, 'display', 'inline-block');
    this.renderer.setStyle(element, 'padding', '4px 10px');
    this.renderer.setStyle(element, 'border-radius', '12px');
    this.renderer.setStyle(element, 'font-size', '12px');
    this.renderer.setStyle(element, 'font-weight', '600');
    this.renderer.setStyle(element, 'background-color', backgroundColor);
    this.renderer.setStyle(element, 'color', textColor);

    this.renderer.setAttribute(element, 'title', tooltip);
  }
}
