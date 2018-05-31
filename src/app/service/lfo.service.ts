import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LfoData } from '../model/lfo-data';

@Injectable()
export class LfoService {
  public lfo$ = new BehaviorSubject<LfoData[]>([]);

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
}
