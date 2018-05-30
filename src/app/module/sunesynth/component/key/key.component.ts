import { Component, Input } from '@angular/core';

@Component({
  selector: 'key',
  templateUrl: './key.component.html'
})
export class KeyComponent {
  @Input() type = 'whole';
  public state = false;

}
