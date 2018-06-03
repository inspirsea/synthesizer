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
   waveShape: Waves.waveShapes[0]
  };

  constructor(private audioService: AudioService, private sourceService: SourceService) { }

  ngOnInit() {
    this.sourceService.addOcillator(this.source);
  }

  public update(): void {
    this.source.waveShape = Waves.waveShapes[this.waveShape];
    this.sourceService.updateSource();
  }
}
