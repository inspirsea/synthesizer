import { Component, OnInit, Input } from '@angular/core';
import { SourceService } from '../../service/source.service';
import { AudioService } from '../../service/audio.service';
import { OcillatorSource } from '../../model/ocillator-source';

@Component({
  selector: 'synth-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

  @Input() title: string;
  @Input() type: string;

  public wavetypes: OscillatorType[] = [
    'sine',
    'square',
    'sawtooth',
    'triangle'
  ];

  public source: OcillatorSource = {
    on: false,
    type: this.wavetypes[0],
    sourcetype: 'ocillator'
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
    const sources = this.sourceService.sources$.getValue();
    sources.push(this.source);
    this.sourceService.sources$.next(sources);
  }

  public updateSource() {
    this.sourceService.sources$.next(this.sourceService.sources$.getValue());
  }
}
