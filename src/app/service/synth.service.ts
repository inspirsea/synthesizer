import { Injectable } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../model/config';
import { NoiseService } from './noise.service';
import { FilterService } from './filter.service';
import { CoreSynthService } from './core-synth.service';
import { FilterEnvelope } from '../utils/filter-envelope';

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

  public createSynthFlow(frequency: number): [GainNode, OscillatorNode, FilterEnvelope[]] {
    const gainNode = this.coreSynthService.audioCtx.createGain();
    const oscillator = this.coreSynthService.audioCtx.createOscillator();
    let envelopes: FilterEnvelope[];

    gainNode.gain.setValueAtTime(0, this.coreSynthService.audioCtx.currentTime);

    oscillator.type = this.config$.getValue().toneType;
    oscillator.frequency.setValueAtTime(frequency, this.coreSynthService.audioCtx.currentTime);
    envelopes = this.filterService.connect(
      oscillator,
      gainNode,
      this.coreSynthService.audioCtx,
      { attackTime: 0.05, decayTime: 0.05, sustainLevel: 1000, releaseTime: 0.1 });

    gainNode.connect(this.coreSynthService.audioCtx.destination);
    oscillator.start();

    return [gainNode, oscillator, envelopes];
  }
}
