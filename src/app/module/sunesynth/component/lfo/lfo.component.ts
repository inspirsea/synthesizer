import { Component } from '@angular/core';
import { LfoService } from '../../../../service/lfo.service';

@Component({
  selector: 'lfo',
  templateUrl: './lfo.component.html'
})
export class LfoComponent {
  public rateValue: 0;
  public shapeValue: 0;

  constructor(private lfoService: LfoService) { }

  public updateRate(): void {

  }

  public updateShape(): void {

  }
}
