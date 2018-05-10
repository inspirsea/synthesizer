import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';

export class VolumeEnvelope {

  private active = false;
  private decaySub: Subscription;

  constructor(private audioContext: AudioContext, private gainNode: GainNode, private adsr: ADSR) {
  }

  public attack() {
    if (!this.active) {
      this.active = true;
      this.reset();
      this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.01);
      this.gainNode.gain.setTargetAtTime(1, this.audioContext.currentTime, this.adsr.attackTime);

      this.decaySub = of(null).pipe(delay(this.adsr.attackTime * 1000)).subscribe(it => {
        this.gainNode.gain.setTargetAtTime(this.adsr.sustainLevel, this.audioContext.currentTime, this.adsr.decayTime);
      });
    }
  }

  public release() {
    this.active = false;
    this.rampDown();
  }

  private rampDown() {
    this.decaySub.unsubscribe();
    this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, this.adsr.releaseTime);
  }

  private reset() {
    this.audioContext.resume();
    if (this.decaySub) {
      this.decaySub.unsubscribe();
    }
  }
}
