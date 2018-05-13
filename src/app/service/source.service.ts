import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Source } from '../model/source';

@Injectable()
export class SourceService {
  public sources$ = new BehaviorSubject<Source[]>([]);

  public createSource(audioContext: AudioContext, source: Source, frequency: number) {
    const sourceNode = audioContext.createOscillator();
    sourceNode.frequency.setValueAtTime(frequency, audioContext.currentTime);
    sourceNode.type = source.type;

    return sourceNode;
  }
}
