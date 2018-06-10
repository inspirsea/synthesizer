import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADSR } from '../model/ADSR';
import { Envelope } from './envelope';
import { OcillatorSource } from '../model/ocillator-source';
import { VolumeService } from '../service/volumeService';

export class VolumeEnvelope extends Envelope {

  private mix: number[] = [1, 1];
  private noiseMix = 0;

  constructor(
    audioContext: AudioContext,
    adsr: ADSR,
    private gainNodes: GainNode[],
    private volumeService: VolumeService,
    private noiseGain: GainNode) {
    super(audioContext, adsr);
  }

  public attack() {
    super.attack();
  }

  public release() {
    super.release();
  }

  public setMix(mix: number[]) {
    this.mix = mix;
  }

  public setNoiseMix(mix: number) {
    this.noiseMix = mix;
  }

  protected setAttack() {
    const volume = 1 * this.volumeService.getVolume();
    for (let i = 0; i < this.gainNodes.length; i++) {
      this.gainNodes[i].gain.setTargetAtTime((this.mix[i] * volume), this.audioContext.currentTime, this.adsr.attackTime);
      this.noiseGain.gain.setTargetAtTime((volume * this.noiseMix), this.audioContext.currentTime, this.adsr.attackTime);
    }
  }

  protected setDecay() {
    const volume = this.volumeService.getVolume() * this.adsr.sustainLevel;
    for (let i = 0; i < this.gainNodes.length; i++) {
      this.gainNodes[i].gain.setTargetAtTime((volume * this.mix[i]), this.audioContext.currentTime, this.adsr.decayTime);
      this.noiseGain.gain.setTargetAtTime((volume * this.noiseMix), this.audioContext.currentTime, this.adsr.decayTime);
    }
  }

  protected setRelease() {
    for (const node of this.gainNodes) {
      node.gain.setTargetAtTime(0, this.audioContext.currentTime, this.adsr.releaseTime);
      this.noiseGain.gain.setTargetAtTime(0, this.audioContext.currentTime, this.adsr.releaseTime);
    }
  }
}
