import { Component } from '@angular/core';
import { LfoService } from '../../../../service/lfo.service';

@Component({
  selector: 'lfo',
  templateUrl: './lfo.component.html'
})
export class LfoComponent {
  public rateValue = 0;
  public gainValue = 0;
  public shapeValue = 0;
  private waveShapes: OscillatorType[] = [
    'sine',
    'triangle',
    'square',
    'sawtooth'
  ];

  constructor(private lfoService: LfoService) { }

  public update(): void {
    this.lfoService.updateLfo(this.rateValue, this.waveShapes[this.shapeValue], this.gainValue);
  }
}
