import { Component, OnInit } from '@angular/core';
import { FilterService, AudioService } from '../../../../service';
import { ADSR } from '../../../../model/ADSR';
import { FilterConfig } from '../../../../model/filter-metadata';
import { Filters } from '../../../../utils/filters';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {
  public res = 0;
  public cutoff = 0;
  public filterType: BiquadFilterType = Filters.filterTypes[0];


  constructor(public filterService: FilterService, private audioService: AudioService) { }

  ngOnInit() {
  }

  public updateCutoff(): void {
    this.filterService.updateCutoff((this.cutoff / 127) * 20000);
  }

  public updateRes(): void {
    const Q = (this.res / 127) * 100;
    this.filterService.updateRes(Q);
  }
}
