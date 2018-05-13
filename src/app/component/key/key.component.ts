import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SynthService } from '../../service/synth.service';
import { Config } from '../../model/config';
import { ADSR } from '../../model/ADSR';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Tween } from '../../utils/tween';
import { VolumeEnvelope } from '../../utils/volume-envelope';
import { CoreSynthService } from '../../service/core-synth.service';
import { FilterService } from '../../service/filter.service';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() binding: string;
  @Input() frequency: number;

  private volumeEnvelope: VolumeEnvelope;
  private gainNode: GainNode;
  private ocillatorNode: OscillatorNode;
  private playing = false;
  private decaySub: Subscription;
  constructor(private synthService: SynthService, private coreSynthService: CoreSynthService, private filterService: FilterService) {
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key === this.binding) {
      this.play();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key === this.binding) {
      this.release();
    }
  }

  ngOnInit() {
    this.load();

    this.filterService.filter$.subscribe(it => {
      this.load();
    });

    this.synthService.config$.subscribe(it => {
      this.updateConfig(it);
    });
  }

  private load() {
    const nodes = this.synthService.createSynthFlow(this.frequency);
    this.gainNode = nodes[0];
    this.ocillatorNode = nodes[1];

    this.volumeEnvelope = new VolumeEnvelope(this.coreSynthService.audioCtx, this.synthService.adsr$.getValue(), this.gainNode);
  }

  public play() {
    this.volumeEnvelope.attack();
  }

  public release() {
    this.volumeEnvelope.release();
  }

  private updateConfig(it: Config) {
    this.ocillatorNode.type = it.toneType;
  }
}
