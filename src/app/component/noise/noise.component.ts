import { Component, OnInit } from '@angular/core';
import { AudioService } from '../../service/audio.service';
import { SourceService } from '../../service/source.service';
import { NoiseSource } from '../../model/noise-source';
import { NoiseType } from '../../model/noise-type';

@Component({
  selector: 'noise-source',
  templateUrl: './noise.component.html',
  styleUrls: ['./noise.component.scss']
})
export class NoiseComponent implements OnInit {

  public on = false;

  public source: NoiseSource = {
    on: false,
    type: NoiseType.white,
    sourcetype: 'noise'
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
  }

  public toggle() {
    this.on = !this.on;
    const sources = this.sourceService.sources$.getValue();
    if (this.on) {
      sources.push(this.source);
    } else {
      const index = sources.indexOf(this.source);
      if (index !== -1) {
        sources.splice(index, 1);
      }
    }

    this.sourceService.sources$.next(sources);
  }

}
