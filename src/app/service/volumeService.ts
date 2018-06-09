import { Injectable } from '@angular/core';

@Injectable()
export class VolumeService {
  private masterVolume = 1;

  public update(volume: number) {
    this.masterVolume = volume;
  }

  public getVolume() {
    return this.masterVolume;
  }
}
