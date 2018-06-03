import { Source } from './source';

export interface LfoData {
  frequency: Changed<number>;
  type: Changed<OscillatorType>;
  gain: Changed<number>;
}

export interface Changed<T> {
  changed: boolean;
  item: T;
}
