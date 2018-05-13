import { Injectable } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../model/config';
import { NoiseService } from './noise.service';
import { FilterService } from './filter.service';
import { AudioService } from './audio.service';
import { SourceService } from './source.service';
import { Source } from '../model/source';

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

  constructor(
    private noiseService: NoiseService,
    private filterService: FilterService,
    private audioService: AudioService,
    private sourceService: SourceService) {
    this.noiseService.createBuffers(this.audioService.audioCtx);
  }

  public createSynthFlow(frequency: number): GainNode[] {
    const ctx = this.audioService.audioCtx as any;
    const constantNode = ctx.createConstantSource();
    const gainNodes = [];
    for (const source of this.sourceService.sources$.getValue()) {
      const gainNode = this.createSourceController(this.audioService.audioCtx, source, frequency);
      constantNode.connect(gainNode.gain);

      gainNode.connect(this.audioService.audioCtx.destination);
      gainNodes.push(gainNode);
    }

    // this.filterService.connect(oscillator, gainNode, this.audioService.audioCtx);

    return gainNodes;
  }

  private createSourceController(audioContext: AudioContext, source: Source, frequency: number) {
    const gainNode = audioContext.createGain();
    const sourceNode = this.sourceService.createSource(audioContext, source, frequency);
    sourceNode.connect(gainNode);
    gainNode.gain.setValueAtTime(0, this.audioService.audioCtx.currentTime);

    sourceNode.start();
    return gainNode;
  }
}
