import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Envelope } from '../utils/envelope';
import { ADSR } from '../model/ADSR';
import { FilterMetadata } from '../model/filter-metadata';

@Injectable()
export class FilterService {

  public filter$ = new BehaviorSubject<FilterMetadata>(null);

  public connect(startNode: AudioNode, endNode: AudioNode, audioContext: AudioContext) {
    let currentNode = startNode;

    if (this.filter$.getValue() != null) {
      const filter = this.createFilter(audioContext, this.filter$.getValue());
      currentNode.connect(filter);
      currentNode = filter;
    }

    currentNode.connect(endNode);
  }

  private createFilter(audioContext: AudioContext, metaData: FilterMetadata) {
    const filter = audioContext.createBiquadFilter();
    filter.type = metaData.type;
    filter.frequency.setValueAtTime(metaData.frequency, audioContext.currentTime);
    filter.Q.setValueAtTime(metaData.Q, audioContext.currentTime);
    filter.gain.setValueAtTime(metaData.gain, audioContext.currentTime);

    return filter;
  }

}
