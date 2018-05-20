import { VolumeEnvelope } from './volume-envelope';
import { SourceService } from '../service/source.service';
import { ADSR } from '../model/ADSR';
import { OcillatorSource } from '../model/ocillator-source';
import { FilterService } from '../service/filter.service';
import { NoiseSource } from '../model/noise-source';
import { Source } from '../model/source';

export class Synth {

  public usedBy = 0;
  private volumeEnvelope: VolumeEnvelope;
  private sourceNodes: OscillatorNode[] = [];

  constructor(
    private audioContext: AudioContext,
    private sourceService: SourceService,
    private filterService: FilterService,
    private adsr: ADSR) {
    this.sourceService.sources.subscribe(it => {
      this.volumeEnvelope = this.createSynth(it);
    });

    this.filterService.filter$.subscribe(it => {
      this.volumeEnvelope = this.createSynth(this.sourceService.sources.getValue());
    });
  }

  public attack(frequency: number) {
    this.setFrequency(frequency, this.audioContext);
    this.volumeEnvelope.attack();
  }

  public release() {
    this.volumeEnvelope.release();
  }

  private setFrequency(frequency: number, audioContext: AudioContext) {
    for (const source of this.sourceNodes) {
      source.frequency.setTargetAtTime(frequency, audioContext.currentTime, 0.001);
    }
  }

  private createSynth(sources: Source[]): VolumeEnvelope {
    this.removeSourceNodes();
    const gainNodes = [];
    for (const source of sources) {
      const gainNode = this.createGain(this.audioContext);
      let sourceNode: AudioNode;
      if (source.sourcetype === 'ocillator') {
        sourceNode = this.createOcillatorSource(this.audioContext, source as OcillatorSource);
        this.sourceNodes.push(sourceNode as OscillatorNode);
      } else {
        sourceNode = this.createNoiseSource(this.audioContext, source as NoiseSource);
      }

      this.filterService.connect(sourceNode, gainNode, this.audioContext);
      gainNode.connect(this.audioContext.destination);
      gainNodes.push(gainNode);
    }

    return new VolumeEnvelope(this.audioContext, this.adsr, gainNodes);
  }

  private createGain(audioContext: AudioContext) {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    return gainNode;
  }

  private createOcillatorSource(audioContext: AudioContext, source: OcillatorSource) {
    const sourceNode = this.sourceService.createOcillatorSource(audioContext, source, 440);
    sourceNode.start();
    return sourceNode;
  }

  private createNoiseSource(audioContext: AudioContext, source: NoiseSource) {
    const sourceNode = this.sourceService.createNoiseSource(audioContext);
    sourceNode.start();
    return sourceNode;
  }

  private removeSourceNodes() {
    for (const node of this.sourceNodes) {
      node.stop();
    }
    this.sourceNodes = [];
  }

  private removeFilterNodes() {
  }
}
