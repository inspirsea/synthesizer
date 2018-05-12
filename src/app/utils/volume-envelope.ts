import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';
import { Envelope } from './envelope';

export class VolumeEnvelope extends Envelope {

  constructor(audioContext: AudioContext, adsr: ADSR, private gainNode: GainNode) {
    super(audioContext, adsr);
  }

  public attack() {
    super.attack();
  }

  public release() {
    super.release();
  }

  protected setAttack() {
    this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.01);
    this.gainNode.gain.setTargetAtTime(1, this.audioContext.currentTime, this.adsr.attackTime);
  }

  protected setDecay() {
    this.gainNode.gain.setTargetAtTime(this.adsr.sustainLevel, this.audioContext.currentTime, this.adsr.decayTime);
  }

  protected setRelease() {
    this.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, this.adsr.releaseTime);
  }
}
