import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LfoData } from '../model/lfo-data';

@Injectable()
export class LfoService {
  private lfo$ = new BehaviorSubject<LfoData>({ frequency: 1 });

  public createLfo(audioContext: AudioContext): [OscillatorNode, GainNode] {
    const ocillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    ocillator.frequency.value = 0;
    ocillator.type = 'sine';
    gainNode.gain.value = 0;

    ocillator.connect(gainNode);
    ocillator.start();

    return [ocillator, gainNode];
  }

  public updateLfo(rate: number) {
    this.lfo$.next({
      frequency: rate
    });
  }

  public connect() {
    return this.lfo$.asObservable();
  }
}
