import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SynthService } from '../../service/synth.service';
import { Config } from '../../model/config';
import { ADSR } from '../../model/ADSR';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent implements OnInit {

  @Input() binding: string;
  @Input() frequenze: number;

  private gainNode = this.synthService.audioCtx.createGain();
  private oscillator = this.synthService.audioCtx.createOscillator();
  private playing = false;
  private releaseMinStart: number;
  constructor(private synthService: SynthService) {
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key === this.binding && !this.playing) {
      this.playing = true;
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
    this.synthService.config$.subscribe(it => this.initialize(it));
  }

  public play() {
    const adsr = this.synthService.adsr$.getValue();

    const attackTime = this.synthService.getCurrentTime() + adsr.attackTime;
    const decayTime = attackTime + adsr.decayTime;

    this.synthService.audioCtx.resume();
    this.gainNode.gain.linearRampToValueAtTime(1, attackTime);
    this.gainNode.gain.linearRampToValueAtTime(adsr.sustainLevel, decayTime);
    this.releaseMinStart = decayTime;
  }

  private initialize(config: Config) {
    this.oscillator.type = config.toneType;
    this.oscillator.frequency.setValueAtTime(this.frequenze, this.synthService.getCurrentTime());
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.synthService.audioCtx.destination);
    this.oscillator.start();
    this.gainNode.gain.setValueAtTime(0, this.synthService.getCurrentTime());
  }

  private release() {
    const delta = this.releaseMinStart - this.synthService.getCurrentTime();
    if (delta > 0) {
      Observable.of(null).delay(delta * 1000).subscribe(it => {
        this.rampDown();
      });
    } else {
      this.rampDown();
    }
  }

  private rampDown() {
    this.playing = false;
    this.gainNode.gain.linearRampToValueAtTime(0, this.synthService.getCurrentTime() + this.synthService.adsr$.getValue().releaseTime);
  }
}
