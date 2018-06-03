import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';
import { Envelope } from './envelope';
import { FilterConfig } from '../model/filter-metadata';

export class FilterEnvelope extends Envelope {

  private cutoff = 0;

  constructor(audioContext: AudioContext, adsr: ADSR, private nodes: BiquadFilterNode[]) {
    super(audioContext, adsr);
  }

  public attack() {
    super.attack();
  }

  public release() {
    super.release();
  }

  public update(filterConfig: FilterConfig) {
    this.cutoff = filterConfig.frequency;
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.cutoff, this.audioContext.currentTime, this.adsr.attackTime);
      node.Q.setValueAtTime(filterConfig.Q, this.audioContext.currentTime);
    }
  }

  protected setAttack() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(20000, this.audioContext.currentTime, this.adsr.attackTime);
    }
  }

  protected setDecay() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.adsr.sustainLevel, this.audioContext.currentTime, this.adsr.decayTime);
    }
  }

  protected setRelease() {
    for (const node of this.nodes) {
      node.frequency.setTargetAtTime(this.cutoff, this.audioContext.currentTime, this.adsr.releaseTime);
    }
  }
}
