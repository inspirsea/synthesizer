export interface FilterMetadata {
  type: BiquadFilterType;
  frequency: FilterParams;
  Q: FilterParams;
  gain: FilterParams;
}

interface FilterParams {
  start: number;
  attack: number;
  sustain: number;
}
