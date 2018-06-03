import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MainViewComponent } from './component/view/main-view.component';
import { KnobComponent } from './component/knob/knob.component';
import { FaderComponent } from './component/fader/fader.component';
import { KeyComponent } from './component/key/key.component';
import { OscComponent } from './component/osc/osc.component';
import { NoiseComponent } from './component/noise/noise.component';
import { FilterComponent } from './component/filter/filter.component';
import { AmpEnvelopeComponent } from './component/ampenv/ampenv.component';
import { FilterEnvelopeComponent } from './component/filterenv/filterenv.component';
import { LfoComponent } from './component/lfo/lfo.component';
import { VolumeComponent } from './component/volume/volume.component';
import { KeyboardComponent } from './component/keyboard/keyboard.component';
import { FrequencyManager } from '../../utils/frequency-manager';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainViewComponent
      }
    ])
  ],
  declarations: [
    MainViewComponent,
    KnobComponent,
    FaderComponent,
    KeyComponent,
    OscComponent,
    NoiseComponent,
    FilterComponent,
    AmpEnvelopeComponent,
    FilterEnvelopeComponent,
    LfoComponent,
    VolumeComponent,
    KeyboardComponent
  ],
  providers: [
    FrequencyManager
  ]
})
export class SunesynthModule { }
