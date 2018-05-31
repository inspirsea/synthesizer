import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../service/filter.service';
import { AudioService } from '../../service/audio.service';
import { ADSR } from '../../model/ADSR';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  public cutoffFrequency = 0;
  public peak = 0;
  public selectedType: BiquadFilterType = 'lowpass';
  public adsr: ADSR = {
    attackTime: 0.1,
    decayTime: 0.1,
    releaseTime: 0.1,
    sustainLevel: 1000,
    startLevel: 200
  };

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

  constructor(public filterService: FilterService, private audioService: AudioService) {
  }

  ngOnInit() {
  }

  public changeFilter() {
    this.filterService.filter$.next({
      type: this.selectedType,
      frequency: this.adsr.startLevel,
      Q: this.peak,
      gain: 0,
      adsr: this.adsr
    });
  }
}
