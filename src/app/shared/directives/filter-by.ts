
import {Directive,Input,OnChanges,TemplateRef,ViewContainerRef} from '@angular/core';

import { IAttribute } from '../../interface/attribute.interface';

interface FilterByContext {
  item: IAttribute;
  term: string;
} // defines the data expected by the directive

@Directive({
  selector: '[appFilterBy]',
  standalone: true
})
export class FilterByDirective implements OnChanges {

  @Input({ required: true }) appFilterBy!: FilterByContext; //receives current attribute and search term

  private hasView = false; //?

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef // provides a place where angular can insert or clear template view
  ) {}

  ngOnChanges(): void { // runs when change in directive
    const item = this.appFilterBy?.item; //? making it optional
    const term = (this.appFilterBy?.term ?? '').trim().toLowerCase();

    const matches =
      !!item &&
      (
        term === '' ||
        item.AttributeName.toLowerCase().includes(term) ||
        item.BusinessUnitName.toLowerCase().includes(term)
      );

    if (matches && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef); //createEmbeddedView - tells angular to display the template
      this.hasView = true;
    } else if (!matches && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
