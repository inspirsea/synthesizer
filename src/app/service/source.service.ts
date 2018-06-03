import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OcillatorSource } from '../model/ocillator-source';
import { NoiseSource } from '../model/noise-source';
import { Source } from '../model/source';
import { NoiseService } from './noise.service';

@Injectable()
export class SourceService {
  private ocillatorData$ = new BehaviorSubject<OcillatorSource[]>([]);

  constructor(private noiseService: NoiseService) {
  }

  public createOcillatorSource(audioContext: AudioContext, frequency: number) {
    const sourceNode = audioContext.createOscillator();
    sourceNode.frequency.setValueAtTime(frequency, audioContext.currentTime);

    return sourceNode;
  }

  public createNoiseSource(audioContext: AudioContext) {
    return this.noiseService.getWhiteNoiseNode(audioContext);
  }

  public addOcillator(source: OcillatorSource) {
    this.ocillatorData$.getValue().push(source);
  }

  public updateSource() {
    this.ocillatorData$.next(this.ocillatorData$.getValue());
  }

  public connect() {
    return this.ocillatorData$.asObservable();
  }
}
