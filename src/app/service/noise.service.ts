import { Injectable } from '@angular/core';

@Injectable()
export class NoiseService {

  private whiteNoiseBuffer: AudioBuffer;

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
    whiteNoiseSource.start(0);

    return whiteNoiseSource;
  }
}
