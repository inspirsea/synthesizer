import { Injectable } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Config } from '../model/config';

@Injectable()
export class SynthService {

  private window = window as any;
  private defaultADSR: ADSR = {
    attackTime: 0.05,
    decayTime: 0.05,
    sustainLevel: 0.5,
    releaseTime: 0.1
  };

  private defaultConfig: Config = {
    toneType: 'sine'
  };

  public adsr$ = new BehaviorSubject<ADSR>(this.defaultADSR);
  public config$ = new BehaviorSubject<Config>(this.defaultConfig);
  public audioCtx = new (this.window.AudioContext || this.window.webkitAudioContext)() as AudioContext;

  public getCurrentTime() {
    return this.audioCtx.currentTime;
  }
}
