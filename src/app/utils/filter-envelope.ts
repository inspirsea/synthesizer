// import { of, Subscription } from 'rxjs';
// import { delay } from 'rxjs/operators';
// import { ADSR } from '../model/ADSR';
// import { Envelope } from './envelope';
// import { FilterMetadata } from '../model/filter-metadata';

// export class FilterEnvelope extends Envelope {

//   constructor(audioContext: AudioContext, adsr: ADSR, private filter: BiquadFilterNode, private metadata: FilterMetadata) {
//     super(audioContext, adsr);
//   }

//   public attack() {
//     super.attack();
//   }

//   public release() {
//     super.release();
//   }

//   protected setAttack() {
//     this.filter.frequency.setTargetAtTime(this.metadata.frequency.start, this.audioContext.currentTime, 0.01);
//     this.filter.frequency.setTargetAtTime(this.metadata.frequency.attack, this.audioContext.currentTime, this.adsr.attackTime);
//   }

//   protected setDecay() {
//     this.filter.frequency.setTargetAtTime(this.metadata.frequency.sustain, this.audioContext.currentTime, this.adsr.decayTime);
//   }

//   protected setRelease() {
//     this.filter.frequency.setTargetAtTime(this.metadata.frequency.start, this.audioContext.currentTime, this.adsr.releaseTime);
//   }
// }
