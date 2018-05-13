import { Injectable } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../model/config';
import { NoiseService } from './noise.service';
import { FilterService } from './filter.service';
import { CoreSynthService } from './core-synth.service';

@Injectable()
export class SynthService {

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

  constructor(private noiseService: NoiseService, private filterService: FilterService, private coreSynthService: CoreSynthService) {
    this.noiseService.createBuffers(this.coreSynthService.audioCtx);
  }

  public createSynthFlow(frequency: number): [GainNode, OscillatorNode] {
    const gainNode = this.coreSynthService.audioCtx.createGain();
    const oscillator = this.coreSynthService.audioCtx.createOscillator();

    gainNode.gain.setValueAtTime(0, this.coreSynthService.audioCtx.currentTime);

    oscillator.type = this.config$.getValue().toneType;
    oscillator.frequency.setValueAtTime(frequency, this.coreSynthService.audioCtx.currentTime);
    this.filterService.connect(oscillator, gainNode, this.coreSynthService.audioCtx);

    gainNode.connect(this.coreSynthService.audioCtx.destination);
    oscillator.start();

    return [gainNode, oscillator];
  }
}
