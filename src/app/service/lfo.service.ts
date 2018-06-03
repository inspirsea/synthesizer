import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LfoConfig } from '../model/lfo-data';

@Injectable()
export class LfoService {
  private lfo$ = new BehaviorSubject<LfoConfig>({
    frequency: null,
    mix: null,
    type: null
  });

  public createLfo(audioContext: AudioContext): [OscillatorNode, GainNode] {
    const ocillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    ocillator.frequency.value = 1;
    ocillator.type = 'sine';
    gainNode.gain.value = 100;

    ocillator.connect(gainNode);
    ocillator.start();

    return [ocillator, gainNode];
  }

  public updateFrequency(freq: number): void {
    const lfo = this.lfo$.getValue();

    lfo.frequency = freq;

    this.lfo$.next(lfo);
  }

  public updateShape(shape: OscillatorType): void {
    const lfo = this.lfo$.getValue();

    lfo.type = shape;

    this.lfo$.next(lfo);
  }

  public updateMix(mix: number): void {
    const lfo = this.lfo$.getValue();

    lfo.mix = mix;

    this.lfo$.next(lfo);
  }

  public connect() {
    return this.lfo$.asObservable();
  }
}
