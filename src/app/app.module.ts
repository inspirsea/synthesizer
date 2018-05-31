import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SynthService } from './service/synth.service';
import { FrequenciesService } from './service/frequencies.service';
import { NoiseService } from './service/noise.service';
import { FilterService } from './service/filter.service';
import { SourceService } from './service/source.service';
import { AudioService } from './service/audio.service';
import { LfoService } from './service/lfo.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: '**',
        loadChildren: './module/sunesynth/sunesynth.module#SunesynthModule'
      }
    ])
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
