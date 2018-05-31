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
    let filter: BiquadFilterNode = null;

    if (this.filter$.getValue() != null) {
      filter = this.createFilter(audioContext, this.filter$.getValue());
      currentNode.connect(filter);
      currentNode = filter;
    }

    currentNode.connect(endNode);

    return filter;
  }

  public setADSR(adsr: ADSR): void {
    const filter = this.filter$.getValue();

    filter.adsr = adsr;
    this.filter$.next(filter);
  }

  public setFilterType(type: BiquadFilterType): void {
    const filter = this.filter$.getValue();

    filter.type = type;
    this.filter$.next(filter);
  }

  public setCutoffFrequency(frequency: number): void {
    const filter = this.filter$.getValue();

    filter.frequency = frequency;
    this.filter$.next(filter);
  }

  public setQ(q: number): void {
    const filter = this.filter$.getValue();

    filter.Q = q;
    this.filter$.next(filter);
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
