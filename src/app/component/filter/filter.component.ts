import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../service/filter.service';
import { CoreSynthService } from '../../service/core-synth.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  constructor(public filterService: FilterService, private coreSynthService: CoreSynthService) {
  }

  ngOnInit() {
  }

  public addFilter() {
    const filters = this.filterService.filtersMetadata$.getValue();
    filters.push({
      type: 'lowpass',
      frequency: {
        start: 10,
        attack: 100,
        sustain: 100
      },
      gain: null,
      Q: null
    });
    this.filterService.filtersMetadata$.next(filters);
  }

}
