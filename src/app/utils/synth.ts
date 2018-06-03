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
import { FilterConfig } from '../model/filter-metadata';
import { LfoConfig } from '../model/lfo-data';

export class Synth {

  public usedBy = 0;
  private amplitudeAdsr: ADSR = {} as any;
  private filterAdsr: ADSR = {
    attackTime: 0.01,
    decayTime: 0.01,
    releaseTime: 0.01,
    sustainLevel: 0.5
  };
  private envelopes: Envelope[];
  private filterEnvelope: FilterEnvelope;
  private sourceNodes: OscillatorNode[] = [];
  private filterNodes: BiquadFilterNode[] = [];
  private nrOfOcillators = 2;
  private nrOfNoiseGenerators = 1;
  private nrOfFilters = 1;

  private lfos: [OscillatorNode, GainNode][] = [];

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

    this.envelopes = this.createSynth();

    this.sourceService.connect().subscribe(it => {
      for (let i = 0; i < this.nrOfOcillators; i++) {
        if (it[0]) {
          this.sourceNodes[i].type = it[i].waveShape;
        }
      }
    });

    this.filterService.connectFilterData().subscribe(it => {
      this.filterAdsr.attackTime = it.adsr.attackTime;
      this.filterAdsr.decayTime = it.adsr.decayTime;
      this.filterAdsr.releaseTime = it.adsr.releaseTime;
      this.filterAdsr.sustainLevel = it.adsr.sustainLevel;
      this.filterEnvelope.update(it);
    });

    this.lfoService.connect().subscribe(it => {
      this.updateLfo(it, this.nrOfOcillators, this.lfos, this.audioContext);
    });

  }

  public attack(frequency: number) {
    this.setFrequency(frequency, this.audioContext);
    for (const envelope of this.envelopes) {
      envelope.attack();
    }
    this.filterEnvelope.attack();
  }

  public release() {
    for (const envelope of this.envelopes) {
      envelope.release();
    }
    this.filterEnvelope.release();
  }

  private setFrequency(frequency: number, audioContext: AudioContext) {
    for (const source of this.sourceNodes) {
      source.frequency.setValueAtTime(frequency, audioContext.currentTime);
    }
  }

  private createSynth(): Envelope[] {
    const gainNodes = [];
    const envelopes = [];

    for (let i = 0; i < this.nrOfOcillators; i++) {
      const gainNode = this.createGain(this.audioContext);
      const sourceNode = this.createOcillatorSource(this.audioContext);
      this.sourceNodes.push(sourceNode);
      const lfo = this.lfoService.createLfo(this.audioContext);
      lfo[1].connect(sourceNode.frequency);
      this.lfos.push(lfo);

      this.filterNodes.push(this.filterService.connect(sourceNode, gainNode, this.audioContext));
      gainNode.connect(this.audioContext.destination);
      gainNodes.push(gainNode);
    }

    this.filterEnvelope = new FilterEnvelope(this.audioContext, this.filterAdsr, this.filterNodes);
    envelopes.push(new VolumeEnvelope(this.audioContext, this.amplitudeAdsr, gainNodes));

    return envelopes;
  }

  private createGain(audioContext: AudioContext) {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    return gainNode;
  }

  private createOcillatorSource(audioContext: AudioContext): OscillatorNode {
    const sourceNode = this.sourceService.createOcillatorSource(audioContext, 440);
    sourceNode.start();
    return sourceNode;
  }

  private createNoiseSource(audioContext: AudioContext, source: NoiseSource) {
    const sourceNode = this.sourceService.createNoiseSource(audioContext);
    sourceNode.start();
    return sourceNode;
  }

  private updateLfo(lfoConfig: LfoConfig, nrOfOcillators: number, lfos: [OscillatorNode, GainNode][], audioContext: AudioContext) {
    if (lfoConfig) {
      for (let i = 0; i < nrOfOcillators; i++) {
        lfos[i][0].frequency.setValueAtTime(lfoConfig.frequency, audioContext.currentTime);
        lfos[i][0].type = lfoConfig.type;
        lfos[i][1].gain.setValueAtTime(lfoConfig.mix, audioContext.currentTime);
      }
    }
  }
}
