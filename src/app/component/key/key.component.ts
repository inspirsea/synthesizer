import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SynthService } from '../../service/synth.service';
import { Config } from '../../model/config';
import { ADSR } from '../../model/ADSR';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Tween } from '../../utils/tween';
import { VolumeEnvelope } from '../../utils/volume-envelope';
import { FilterService } from '../../service/filter.service';
import { AudioService } from '../../service/audio.service';
import { SourceService } from '../../service/source.service';
import { Synth } from '../../utils/synth';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent {

  @Input() binding: string;
  @Input() frequency: number;

  private synth: Synth;

  constructor(
    private synthService: SynthService) {
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

  public play() {
    if (!this.synth || (this.synth.usedBy !== this.frequency)) {
      this.synth = this.synthService.getSynth(this.frequency);
    }

    this.synth.attack(this.frequency);
  }

  public release() {
    if (this.synth) {
      this.synth.release();
    }
  }
}
