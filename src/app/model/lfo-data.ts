import { Source } from './source';
import { Changed } from './changed';

export interface LfoConfig {
  frequency: number;
  type: OscillatorType;
  mix: number;
}
