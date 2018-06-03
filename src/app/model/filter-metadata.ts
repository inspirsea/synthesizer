import { ADSR } from './ADSR';

export interface FilterConfig {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
  gain: number;
  adsr: ADSR;
}
