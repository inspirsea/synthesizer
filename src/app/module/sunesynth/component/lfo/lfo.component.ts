import { Component } from '@angular/core';
import { LfoService } from '../../../../service/lfo.service';
import { Waves } from '../../../../utils/Waves';

@Component({
  selector: 'lfo',
  templateUrl: './lfo.component.html'
})
export class LfoComponent {
  public freqValue = 0;
  public mixValue = 0;
  public shapeValue = 0;

  private freq = 0;
  private mix = 0;

  constructor(private lfoService: LfoService) { }

  public updateFreq(): void {
    this.freq = (this.freqValue / 127) * 20;
    this.lfoService.updateFrequency(this.freq);
  }

  public updateMix(): void {
    this.mix = (this.mixValue / 127) * 100;
    this.lfoService.updateMix(this.mix);
  }

  public updateShape(): void {
    this.lfoService.updateShape(Waves.waveShapes[this.shapeValue]);
  }
}
