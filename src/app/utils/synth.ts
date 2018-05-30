import { VolumeEnvelope } from './volume-envelope';
import { SourceService } from '../service/source.service';
import { ADSR } from '../model/ADSR';
import { OcillatorSource } from '../model/ocillator-source';
import { FilterService } from '../service/filter.service';
import { NoiseSource } from '../model/noise-source';
import { LfoService } from '../service/lfo.service';
import { Source } from '../model/source';
import { FilterEnvelope } from './filter-envelope';
import { Envelope } from './envelope';

export class Synth {

  public usedBy = 0;
  private envelopes: Envelope[];
  private sourceNodes: OscillatorNode[] = [];

  constructor(
    private audioContext: AudioContext,
    private sourceService: SourceService,
    private filterService: FilterService,
    private lfoService: LfoService,
    private adsr: ADSR) {
    this.sourceService.sources$.subscribe(it => {
      this.envelopes = this.createSynth();
    });

    this.filterService.filter$.subscribe(it => {
      this.envelopes = this.createSynth();
    });

    this.lfoService.lfo$.subscribe(it => {
      this.envelopes = this.createSynth();
    });
  }

  public attack(frequency: number) {
    this.setFrequency(frequency, this.audioContext);
    for (const envelope of this.envelopes) {
      envelope.attack();
    }
  }

  public release() {
    for (const envelope of this.envelopes) {
      envelope.release();
    }
  }

  private setFrequency(frequency: number, audioContext: AudioContext) {
    for (const source of this.sourceNodes) {
      source.frequency.setTargetAtTime(frequency, audioContext.currentTime, 0.001);
    }
  }

  private createSynth(): Envelope[] {
    this.removeSourceNodes();

    const gainNodes = [];
    const filterNodes = [];
    const envelopes = [];
    const sources = this.sourceService.sources$.getValue();
    const lfos = this.lfoService.lfo$.getValue();

    for (const source of sources) {
      const gainNode = this.createGain(this.audioContext);
      let sourceNode: any;
      if (source.sourcetype === 'ocillator') {
        sourceNode = this.createOcillatorSource(this.audioContext, source as OcillatorSource);
        if (this.lfoService.lfo$.getValue()[0]) {
          const lfo = this.lfoService.createLfo(this.lfoService.lfo$.getValue()[0], this.audioContext);
          lfo.connect(sourceNode.frequency);
        }

        this.sourceNodes.push(sourceNode as OscillatorNode);
      } else {
        sourceNode = this.createNoiseSource(this.audioContext, source as NoiseSource);
      }

      filterNodes.push(this.filterService.connect(sourceNode, gainNode, this.audioContext));
      gainNode.connect(this.audioContext.destination);
      gainNodes.push(gainNode);
    }

    const filterMetaData = this.filterService.filter$.getValue();
    if (filterMetaData != null) {
      envelopes.push(new FilterEnvelope(this.audioContext, filterMetaData.adsr, filterNodes));
    }

    envelopes.push(new VolumeEnvelope(this.audioContext, this.adsr, gainNodes));

    return envelopes;
  }

  private createGain(audioContext: AudioContext) {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    return gainNode;
  }

  private createOcillatorSource(audioContext: AudioContext, source: OcillatorSource): OscillatorNode {
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
