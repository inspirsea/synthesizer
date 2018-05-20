import { NoiseType } from './noise-type';
import { Source } from './source';

export class NoiseSource implements Source {
  sourcetype: string;
  type: NoiseType;
  on: boolean;
}
