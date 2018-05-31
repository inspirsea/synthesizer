import { Component } from '@angular/core';
import { ADSR } from '../../../../model/ADSR';
import { SynthService } from '../../../../service/synth.service';

@Component({
  selector: 'amp-env',
  templateUrl: './ampenv.component.html'
})
export class AmpEnvelopeComponent {
  public attackValue = 0;
  public delayValue = 63;
  public sustainValue = 63;
  public releaseValue = 24;

  constructor(private synthService: SynthService) { }

  public updateADSR(): void {
    const adsr: ADSR = {
      attackTime: (this.attackValue / 127) * 4,
      decayTime: (this.delayValue / 127) * 4,
      sustainLevel: (this.sustainValue / 127) * 100,
      releaseTime: (this.releaseValue / 127) * 4
    };

    this.synthService.updateADSR(adsr);
  }
}