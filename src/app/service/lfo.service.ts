import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LfoData } from '../model/lfo-data';

@Injectable()
export class LfoService {
  private lfo$ = new BehaviorSubject<LfoData>({ frequency: 1, type: 'sine', gain: 100 });

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

  public updateLfo(rate: number, type: OscillatorType, gain: number) {
    this.lfo$.next({
      frequency: rate,
      gain: gain,
      type: type
    });
  }

  public connect() {
    return this.lfo$.asObservable();
  }
}
