import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';
import { Envelope } from './envelope';

export class FilterEnvelope extends Envelope {

  constructor(audioContext: AudioContext, adsr: ADSR, private cutOffFreq, private nodes: BiquadFilterNode[]) {
    super(audioContext, adsr);
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.cutOffFreq, this.audioContext.currentTime, this.adsr.attackTime);
    }
  }

  public attack() {
    super.attack();
  }

  public release() {
    super.release();
  }

  protected setAttack() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(1, this.audioContext.currentTime, this.adsr.attackTime);
    }
  }

  protected setDecay() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.adsr.sustainLevel, this.audioContext.currentTime, this.adsr.decayTime);
    }
  }

  protected setRelease() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.cutOffFreq, this.audioContext.currentTime, this.adsr.releaseTime);
    }
  }
}
