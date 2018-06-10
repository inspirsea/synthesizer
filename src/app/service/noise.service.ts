import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NoiseService {

  private whiteNoiseBuffer: AudioBuffer;
  public noiseMix = new BehaviorSubject<number>(0);

  constructor() {
  }

  public createBuffers(audioContext: AudioContext) {
    const bufferSize = 2 * audioContext.sampleRate;
    this.whiteNoiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = this.whiteNoiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  public getWhiteNoiseNode(audioContext: AudioContext) {
    const whiteNoiseSource = audioContext.createBufferSource();
    whiteNoiseSource.buffer = this.whiteNoiseBuffer;
    whiteNoiseSource.loop = true;

    return whiteNoiseSource;
  }

  public updateMix(mix: number) {
    this.noiseMix.next(mix);
  }

  public connect() {
    return this.noiseMix.asObservable();
  }
}
