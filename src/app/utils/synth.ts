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
import { SynthService } from '../service/synth.service';
import { FilterMetadata } from '../model/filter-metadata';

export class Synth {

  public usedBy = 0;
  private amplitudeAdsr: ADSR = {} as any;
  private envelopes: Envelope[];
  private sourceNodes: OscillatorNode[] = [];
  private filterNodes: BiquadFilterNode[] = [];
  private lfos: OscillatorNode[] = [];
  private lfosGain: GainNode[] = [];
  private sources: Source[];
  private filterMetaData: FilterMetadata;

  constructor(
    private audioContext: AudioContext,
    private sourceService: SourceService,
    private filterService: FilterService,
    private lfoService: LfoService,
    private synthService: SynthService) {

    synthService.connect().subscribe(it => {
      this.amplitudeAdsr.attackTime = it.attackTime;
      this.amplitudeAdsr.decayTime = it.decayTime;
      this.amplitudeAdsr.releaseTime = it.releaseTime;
      this.amplitudeAdsr.sustainLevel = it.sustainLevel;
    });

    this.sourceService.connect().subscribe(it => {
      this.sources = it;
      this.envelopes = this.createSynth();
    });

    this.filterService.connectFilterData().subscribe(it => {
      this.filterMetaData = it;
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
    this.removeNodes();

    const gainNodes = [];
    const envelopes = [];
    const lfos = this.lfoService.lfo$.getValue();

    for (const source of this.sources) {
      const gainNode = this.createGain(this.audioContext);
      let sourceNode: any;
      if (source.sourcetype === 'ocillator') {
        sourceNode = this.createOcillatorSource(this.audioContext, source as OcillatorSource);
        if (this.lfoService.lfo$.getValue()[0]) {
          const lfo = this.lfoService.createLfo(this.lfoService.lfo$.getValue()[0], this.audioContext);
          lfo[1].connect(sourceNode.frequency);
          this.lfosGain.push(lfo[1]);
          this.lfos.push(lfo[0]);
        }

        this.sourceNodes.push(sourceNode as OscillatorNode);
      } else {
        sourceNode = this.createNoiseSource(this.audioContext, source as NoiseSource);
      }

      this.filterNodes.push(this.filterService.connect(sourceNode, gainNode, this.audioContext));
      gainNode.connect(this.audioContext.destination);
      gainNodes.push(gainNode);
    }

    if (this.filterMetaData != null) {
      envelopes.push(new FilterEnvelope(this.audioContext, this.filterMetaData.adsr, this.filterMetaData.frequency, this.filterNodes));
    }

    envelopes.push(new VolumeEnvelope(this.audioContext, this.amplitudeAdsr, gainNodes));

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

  private removeNodes() {
    for (const node of this.sourceNodes) {
      node.stop();
    }
    this.sourceNodes = [];

    for (const node of this.lfos) {
      node.stop();
    }

    this.lfos = [];
    this.lfosGain = [];
    this.filterNodes = [];
  }

}
