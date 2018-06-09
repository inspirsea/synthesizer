import { Component, OnInit } from '@angular/core';
import { SourceService, AudioService } from '../../../../service';
import { OcillatorSource } from '../../../../model/ocillator-source';
import { Waves } from '../../../../utils/Waves';

@Component({
  selector: 'osc',
  templateUrl: './osc.component.html'
})
export class OscComponent implements OnInit {
  public waveShape = 0;
  public frequencyValue = 63;
  public fineTuneValue = 63;
  public mixValue = 63;
  public source: OcillatorSource = {
   waveShape: Waves.waveShapes[0],
   freq: this.frequencyValue,
   fine: this.fineTuneValue,
   mix: this.mixValue
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
    this.sourceService.addOcillator(this.source);
  }

  public update(): void {
    this.source.waveShape = Waves.waveShapes[this.waveShape];
    this.sourceService.updateSource();
  }

  public updateFrequency() {
    this.source.freq = ((this.frequencyValue / 127) * 12) - 6;
    this.sourceService.updateSource();
  }

  public updateFine() {
    this.source.fine = ((this.fineTuneValue / 127) * 2)  - 1;
    this.sourceService.updateSource();
  }

  public updateMix() {
    this.source.mix = ((this.mixValue / 127));
    this.sourceService.updateSource();
  }
}
