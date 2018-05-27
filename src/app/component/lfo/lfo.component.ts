import { Component, OnInit } from '@angular/core';
import { LfoData } from '../../model/lfo-data';
import { LfoService } from '../../service/lfo.service';

@Component({
  selector: 'lfo',
  templateUrl: './lfo.component.html',
  styleUrls: ['./lfo.component.scss']
})
export class LfoComponent implements OnInit {

  public lfo: LfoData = {
    frequency: 10,
    source: null,
  };

  public on = false;

  constructor(private lfoService: LfoService) { }

  ngOnInit() {
  }

  public toggle() {
    this.on = !this.on;
    const lfos = this.lfoService.lfo$.getValue();
    if (this.on) {
      lfos.push(this.lfo);
    } else {
      const index = lfos.indexOf(this.lfo);

      if (index !== -1) {
        lfos.splice(index, 1);
      }
    }

    this.lfoService.lfo$.next(lfos);
  }

  public lfoChange() {
    this.lfoService.lfo$.next(this.lfoService.lfo$.getValue());
  }
}
