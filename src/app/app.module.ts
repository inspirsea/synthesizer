import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { KeyboardComponent } from './component/keyboard/keyboard.component';
import { SynthService } from './service/synth.service';
import { KeyComponent } from './component/key/key.component';
import { FrequenciesService } from './service/frequencies.service';
import { AdsrComponent } from './component/adsr/adsr.component';
import { NoiseService } from './service/noise.service';
import { FilterService } from './service/filter.service';
import { FilterComponent } from './component/filter/filter.component';
import { SourceComponent } from './component/source/source.component';
import { SynthesizerComponent } from './component/synthesizer/synthesizer.component';
import { SourceService } from './service/source.service';
import { AudioService } from './service/audio.service';
import { NoiseComponent } from './component/noise/noise.component';
import { LfoComponent } from './component/lfo/lfo.component';
import { LfoService } from './service/lfo.service';


@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent,
    KeyComponent,
    AdsrComponent,
    FilterComponent,
    SourceComponent,
    SynthesizerComponent,
    NoiseComponent,
    LfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    SynthService,
    FrequenciesService,
    NoiseService,
    FilterService,
    AudioService,
    SourceService,
    LfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
