import { Component, OnInit } from '@angular/core';
import { SynthService } from '../../service/synth.service';

@Component({
  selector: 'adsr',
  templateUrl: './adsr.component.html',
  styleUrls: ['./adsr.component.css']
})
export class AdsrComponent implements OnInit {

  public adsr = this.synthService.adsr$.getValue();
  public selectedTone: OscillatorType = 'sine';

  constructor(private synthService: SynthService) { }

  ngOnInit() {
  }

  public changeValue() {
    this.synthService.adsr$.next(this.adsr);
  }

  public changeToneType(toneType: OscillatorType) {
    this.synthService.config$.next({
      toneType: toneType
    });
  }
}
