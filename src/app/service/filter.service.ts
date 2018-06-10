import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Envelope } from '../utils/envelope';
import { ADSR } from '../model/ADSR';
import { FilterConfig } from '../model/filter-metadata';
import { Filters } from '../utils/filters';

@Injectable()
export class FilterService {

  private filter$ = new BehaviorSubject<FilterConfig>({
    adsr: {
      attackTime: 0.1,
      decayTime: 0.1,
      releaseTime: 0.1,
      sustainLevel: 0.5
    },
    frequency: 1000,
    gain: 0,
    Q: 0,
    type: Filters.filterTypes[0]
  });

  public connect(startNode: AudioNode, endNode: AudioNode, audioContext: AudioContext) {
    const filter = this.createFilter(audioContext, this.filter$.getValue());

    startNode.connect(filter);
    filter.connect(endNode);

    return filter;
  }

  public addFilter(filterConfig: FilterConfig) {
    this.filter$.next(filterConfig);
  }

  public updateRes(res: number) {
    const filterConfig = this.filter$.getValue();

    filterConfig.Q = res;

    this.filter$.next(filterConfig);
  }

  public updateCutoff(cutoff: number) {
    const filterConfig = this.filter$.getValue();

    filterConfig.frequency = cutoff;

    this.filter$.next(filterConfig);
  }

  public updateAdsr(adsr: ADSR) {
    const filterConfig = this.filter$.getValue();

    filterConfig.adsr = adsr;

    this.filter$.next(filterConfig);
  }

  public connectFilterData() {
    return this.filter$.asObservable();
  }

  private createFilter(audioContext: AudioContext, filterConfig: FilterConfig) {
    const filter = audioContext.createBiquadFilter();
    filter.type = filterConfig.type;
    filter.frequency.setValueAtTime(filterConfig.frequency, audioContext.currentTime);
    filter.Q.setValueAtTime(filterConfig.Q, audioContext.currentTime);
    filter.gain.setValueAtTime(filterConfig.gain, audioContext.currentTime);

    return filter;
  }
}
