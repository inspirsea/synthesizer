import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MainViewComponent } from './component/view/main-view.component';
import { KnobComponent } from './component/knob/knob.component';
import { FaderComponent } from './component/fader/fader.component';
import { KeyComponent } from './component/key/key.component';

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
    KeyComponent
  ],
  providers: [

  ]
})
export class SunesynthModule { }
