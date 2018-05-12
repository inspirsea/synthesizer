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
import { CoreSynthService } from './service/core-synth.service';


@NgModule({
  declarations: [
    AppComponent,
    KeyboardComponent,
    KeyComponent,
    AdsrComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SynthService, FrequenciesService, NoiseService, FilterService, CoreSynthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
