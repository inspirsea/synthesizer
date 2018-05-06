import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SynthService } from '../../service/synth.service';
import { Config } from '../../model/config';
import { ADSR } from '../../model/ADSR';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() binding: string;
  @Input() frequenze: number;

  private gainNode = this.synthService.audioCtx.createGain();
  private oscillator = this.synthService.audioCtx.createOscillator();
  private playing = false;
  private decaySub: Subscription;
  constructor(private synthService: SynthService) {
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
    this.synthService.config$.subscribe(it => this.initialize(it));
  }

  public play() {
    if (!this.playing) {
      this.playing = true;
      this.reset();
      this.gainNode.gain.setValueAtTime(0, this.synthService.getCurrentTime());
      const adsr = this.synthService.adsr$.getValue();

      const attackTime = this.synthService.getCurrentTime() + adsr.attackTime;

      this.gainNode.gain.linearRampToValueAtTime(1, attackTime);

      this.decaySub = of(null).pipe(delay(adsr.attackTime * 1000)).subscribe(it => {
        this.gainNode.gain.linearRampToValueAtTime(adsr.sustainLevel, this.synthService.getCurrentTime() + adsr.decayTime);
      });
    }
  }

  private reset() {
    this.synthService.audioCtx.resume();
    this.gainNode.gain.cancelScheduledValues(this.synthService.getCurrentTime());
    if (this.decaySub) {
      this.decaySub.unsubscribe();
    }
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
    this.playing = false;
    this.rampDown();
  }

  private rampDown() {
    this.decaySub.unsubscribe();
    this.gainNode.gain.cancelScheduledValues(this.synthService.getCurrentTime());
    this.gainNode.gain.linearRampToValueAtTime(0, this.getReleaseTime());
    console.log(this.gainNode.gain.value);
  }

  private getReleaseTime() {
    return this.synthService.getCurrentTime() + this.synthService.adsr$.getValue().releaseTime;
  }
}
