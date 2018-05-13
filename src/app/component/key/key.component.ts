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

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() binding: string;
  @Input() frequency: number;

  private volumeEnvelope: VolumeEnvelope;
  private gainNodes: GainNode[];
  private playing = false;
  private decaySub: Subscription;
  constructor(
    private synthService: SynthService,
    private audioService: AudioService,
    private filterService: FilterService,
    private sourceService: SourceService) {
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

    this.sourceService.sources$.subscribe(it => {
      this.load();
    });
  }

  private load() {
    this.gainNodes = this.synthService.createSynthFlow(this.frequency);

    this.volumeEnvelope = new VolumeEnvelope(this.audioService.audioCtx, this.synthService.adsr$.getValue(), this.gainNodes);
  }

  public play() {
    this.volumeEnvelope.attack();
  }

  public release() {
    this.volumeEnvelope.release();
  }
}
