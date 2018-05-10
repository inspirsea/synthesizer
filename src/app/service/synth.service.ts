import { Injectable } from '@angular/core';
import { ADSR } from '../model/ADSR';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../model/config';
import { NoiseService } from './noise.service';

@Injectable()
export class SynthService {

  private window = window as any;
  private defaultADSR: ADSR = {
    attackTime: 0.05,
    decayTime: 0.05,
    sustainLevel: 0.5,
    releaseTime: 0.1
  };

  private defaultConfig: Config = {
    toneType: 'sine'
  };

  public adsr$ = new BehaviorSubject<ADSR>(this.defaultADSR);
  public config$ = new BehaviorSubject<Config>(this.defaultConfig);
  public audioCtx = new (this.window.AudioContext || this.window.webkitAudioContext)() as AudioContext;

  constructor(private noiseService: NoiseService) {
    this.noiseService.createBuffers(this.audioCtx);
  }

  public createSynthFlow(frequency: number): [GainNode, OscillatorNode] {
    const gainNode = this.audioCtx.createGain();
    const oscillator = this.audioCtx.createOscillator();
    // const whiteNoise = this.noiseService.getWhiteNoiseNode(this.audioCtx);

    oscillator.type = this.config$.getValue().toneType;
    oscillator.frequency.setValueAtTime(frequency, this.getCurrentTime());
    // whiteNoise.connect(gainNode);
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    oscillator.start();
    gainNode.gain.setValueAtTime(0, this.getCurrentTime());

    return [gainNode, oscillator];
  }

  public getCurrentTime() {
    return this.audioCtx.currentTime;
  }
}
