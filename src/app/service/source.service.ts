import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OcillatorSource } from '../model/ocillator-source';
import { NoiseSource } from '../model/noise-source';
import { Source } from '../model/source';
import { NoiseService } from './noise.service';

@Injectable()
export class SourceService {
  public sources$ = new BehaviorSubject<Source[]>([]);

  constructor(private noiseService: NoiseService) {
  }

  public createOcillatorSource(audioContext: AudioContext, source: OcillatorSource, frequency: number) {
    const sourceNode = audioContext.createOscillator();
    sourceNode.frequency.setValueAtTime(frequency, audioContext.currentTime);
    sourceNode.type = source.type;

    return sourceNode;
  }

  public createNoiseSource(audioContext: AudioContext) {
    return this.noiseService.getWhiteNoiseNode(audioContext);
  }
}
