import { ADSR } from './ADSR';

export interface FilterMetadata {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
  gain: number;
  adsr: ADSR;
}
