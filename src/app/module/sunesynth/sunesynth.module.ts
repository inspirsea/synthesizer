import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainViewComponent } from './component/view/main-view.component';
import { KnobComponent } from './component/knob/knob.component';
import { FaderComponent } from './component/fader/fader.component';

@NgModule({
  imports: [
    CommonModule,
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
    FaderComponent
  ],
  providers: [

  ]
})
export class SunesynthModule { }
