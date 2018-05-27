import { Injectable, OnInit } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../model/config';
import { NoiseService } from './noise.service';
import { FilterService } from './filter.service';
import { AudioService } from './audio.service';
import { SourceService } from './source.service';
import { OcillatorSource } from '../model/ocillator-source';
import { VolumeEnvelope } from '../utils/volume-envelope';
import { Synth } from '../utils/synth';
import { LfoService } from './lfo.service';

@Injectable()
export class SynthService {

  private defaultADSR: ADSR = {
    attackTime: 0.05,
    decayTime: 0.05,
    sustainLevel: 0.5,
    releaseTime: 0.1
  };

  public adsr$ = new BehaviorSubject<ADSR>(this.defaultADSR);
  private synths: Synth[] = [];
  private total = 8;
  private count = 0;

  constructor(
    private noiseService: NoiseService,
    private filterService: FilterService,
    private audioService: AudioService,
    private sourceService: SourceService,
    private lfoService: LfoService) {
    this.noiseService.createBuffers(this.audioService.audioCtx);

    for (let i = 0; i < this.total; i++) {
      this.synths.push(new Synth(
        this.audioService.audioCtx,
        this.sourceService,
        this.filterService,
        this.lfoService,
        this.adsr$.getValue()));
    }
  }

  public getSynth(id: number) {
    const synth = this.synths[this.count++];
    synth.usedBy = id;
    if (this.count >= this.total) {
      this.count = 0;
    }

    return synth;
  }
}
