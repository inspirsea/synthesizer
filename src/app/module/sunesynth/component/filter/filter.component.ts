import { Component, OnInit } from '@angular/core';
import { FilterService, AudioService } from '../../../../service';
import { ADSR } from '../../../../model/ADSR';
import { FilterMetadata } from '../../../../model/filter-metadata';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {
  public res = 0;

  public filterData: FilterMetadata = {
    adsr: {
      attackTime: 0.5,
      decayTime: 0.5,
      sustainLevel: 2000,
      releaseTime: 0.5
    },
    frequency: 1000,
    gain: 0,
    Q: 100,
    type: 'highpass'
  };
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
    this.filterService.addFilter(this.filterData);
  }

  public updateCutoff(): void {
    this.filterService.updateFilter();
  }

  public updateRes(): void {
    this.filterData.Q = (this.res / 127) * 100;

    this.filterService.updateFilter();
  }
}
