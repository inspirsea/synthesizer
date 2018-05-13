import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../service/filter.service';
import { CoreSynthService } from '../../service/core-synth.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public cutoffFrequency = 0;
  public peak = 0;
  public selectedType: BiquadFilterType = 'lowpass';
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

  constructor(public filterService: FilterService, private coreSynthService: CoreSynthService) {
  }

  ngOnInit() {
  }

  public addFilter() {
    this.filterService.filter$.next({
      type: this.selectedType,
      frequency: this.cutoffFrequency,
      Q: this.peak,
      gain: 0
    });
  }
}
