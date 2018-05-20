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

  public source: NoiseSource = {
    on: false,
    type: NoiseType.white,
    sourcetype: 'noise'
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
    const sources = this.sourceService.sources.getValue();
    sources.push(this.source);
    this.sourceService.sources.next(sources);
  }

}
