import { Component } from '@angular/core';
import { NoiseService } from '../../../../service';

@Component({
  selector: 'noise',
  templateUrl: './noise.component.html'
})
export class NoiseComponent {
  public typeValue: 0;
  public mixValue: 0;

  constructor(private noiseService: NoiseService) { }

  public update(): void {
    const mix = (this.mixValue / 127) * 1;

    this.noiseService.updateMix(mix);
  }
}
