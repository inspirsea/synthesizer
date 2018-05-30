import { Component, OnInit } from '@angular/core';
import { FilterService, AudioService } from '../../../../service';
import { ADSR } from '../../../../model/ADSR';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {
  public cutoffValue = 63;
  public resValue = 0;

  public cutoffFreq = 5000;
  public res = 0;
  public filterType: BiquadFilterType = 'lowpass';
  public filterTypes = [
    'lowpass',
    'highpass',
    'bandpass',
    'lowshelf',
    'highshelf',
    'peaking',
    'notch',
    'allpass'
  ];

  constructor(public filterService: FilterService, private audioService: AudioService) { }

  ngOnInit() {
    const adsr: ADSR = {
      startLevel: this.cutoffFreq,
      attackTime: 0,
      decayTime: 0.5,
      sustainLevel: 10000,
      releaseTime: 0.5
    };

    this.filterService.filter$.next({
      type: this.filterType,
      frequency: this.cutoffFreq,
      Q: this.res,
      gain: 0,
      adsr: adsr
    });
  }

  public updateCutoff(): void {
    this.cutoffFreq = (this.cutoffValue / 127) * 10000;

    this.filterService.setCutoffFrequency(this.cutoffFreq);
  }

  public updateRes(): void {
    this.res = (this.resValue / 127) * 100;

    this.filterService.setQ(this.res);
  }
}
