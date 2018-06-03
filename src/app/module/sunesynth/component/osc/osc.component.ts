import { Component, OnInit } from '@angular/core';
import { SourceService, AudioService } from '../../../../service';
import { OcillatorSource } from '../../../../model/ocillator-source';

@Component({
  selector: 'osc',
  templateUrl: './osc.component.html'
})
export class OscComponent implements OnInit {
  private waveShapes: OscillatorType[] = [
    'sine',
    'triangle',
    'square',
    'sawtooth'
  ];

  public waveShape = 0;
  public frequencyValue = 63;
  public fineTuneValue = 63;
  public mixValue = 63;
  public source: OcillatorSource = {
    waveShape: this.waveShapes[this.waveShape]
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
    this.sourceService.addOcillator(this.source);
  }

  public update(): void {
    this.source.waveShape = this.waveShapes[this.waveShape];
    this.sourceService.updateSource();
  }
}
