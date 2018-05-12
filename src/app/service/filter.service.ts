import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Envelope } from '../utils/envelope';
import { FilterEnvelope } from '../utils/filter-envelope';
import { ADSR } from '../model/ADSR';
import { FilterMetadata } from '../model/filter-metadata';

@Injectable()
export class FilterService {

  public filtersMetadata$ = new BehaviorSubject<FilterMetadata[]>([]);
  private envelopes: FilterEnvelope[] = [];

  public connect(startNode: AudioNode, endNode: AudioNode, audioContext: AudioContext, adsr: ADSR) {
    let currentNode = startNode;

    for (const metadata of this.filtersMetadata$.getValue()) {
      const filter = this.createFilter(audioContext, metadata.type);
      currentNode.connect(filter);
      this.envelopes.push(new FilterEnvelope(audioContext, adsr, filter, metadata));
      currentNode = filter;
    }

    currentNode.connect(endNode);

    return this.envelopes;
  }

  private createFilter(audioContext: AudioContext, type: BiquadFilterType) {
    const filter = audioContext.createBiquadFilter();
    filter.type = type;
    filter.Q.setValueAtTime(1000, audioContext.currentTime);
    filter.gain.setValueAtTime(1, audioContext.currentTime);

    return filter;
  }

}
