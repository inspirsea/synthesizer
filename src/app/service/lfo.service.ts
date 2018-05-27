import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LfoData } from '../model/lfo-data';

@Injectable()
export class LfoService {
  public lfo$ = new BehaviorSubject<LfoData[]>([]);

  public createLfo(lfo: LfoData, audioContext: AudioContext) {
    const ocillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    ocillator.frequency.value = lfo.frequency;
    ocillator.type = 'sine';
    gainNode.gain.value = 100;

    ocillator.connect(gainNode);
    ocillator.start();

    return gainNode;
  }
}
