import { Component } from '@angular/core';
import { ADSR } from '../../../../model/ADSR';
import { FilterService } from '../../../../service';

@Component({
  selector: 'filter-env',
  templateUrl: './filterenv.component.html'
})
export class FilterEnvelopeComponent {
  public attackValue = 0;
  public delayValue = 63;
  public sustainValue = 63;
  public releaseValue = 24;

  constructor(private filterService: FilterService) { }

  public updateADSR(): void {
    const adsr: ADSR = {
      attackTime: (this.attackValue / 127) * 4,
      decayTime: (this.delayValue / 127) * 4,
      sustainLevel: (this.sustainValue / 127) * 100,
      releaseTime: (this.releaseValue / 127) * 4
    };

    // this.filterService.setADSR(adsr);
  }
}
