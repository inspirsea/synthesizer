import { Component } from '@angular/core';
import { ADSR } from '../../../../model/ADSR';

@Component({
  selector: 'sunesynth',
  templateUrl: './main-view.component.html'
})
export class MainViewComponent {
  public ampEnv: ADSR = {
    attackTime: 10,
    decayTime: 0,
    sustainLevel: 50,
    releaseTime: 30
  };

  public osc1 = {
    type: 0,
    freq: 64,
    fine: 64
  };

  public osc2 = {
    type: 2,
    freq: 32,
    fine: 96
  };

}
