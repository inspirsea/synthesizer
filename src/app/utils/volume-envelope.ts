import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';
import { Envelope } from './envelope';

export class VolumeEnvelope extends Envelope {

  constructor(audioContext: AudioContext, adsr: ADSR, private gainNodes: GainNode[]) {
    super(audioContext, adsr);
  }

  public attack() {
    super.attack();
  }

  public release() {
    super.release();
  }

  protected setAttack() {
    for (const node of this.gainNodes) {
      node.gain.setTargetAtTime(1, this.audioContext.currentTime, this.adsr.attackTime);
    }
  }

  protected setDecay() {
    for (const node of this.gainNodes) {
      node.gain.setTargetAtTime(this.adsr.sustainLevel, this.audioContext.currentTime, this.adsr.decayTime);
    }
  }

  protected setRelease() {
    for (const node of this.gainNodes) {
      node.gain.setTargetAtTime(0, this.audioContext.currentTime, this.adsr.releaseTime);
    }
  }
}
