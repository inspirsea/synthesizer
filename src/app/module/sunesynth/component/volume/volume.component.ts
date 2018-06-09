import { Component } from '@angular/core';
import { VolumeService } from '../../../../service/volumeService';

@Component({
  selector: 'volume',
  templateUrl: './volume.component.html'
})
export class VolumeComponent {
  public volumeValue = 63;

  constructor(private volumeService: VolumeService) {
  }

  public updateVolume() {
    this.volumeService.update((this.volumeValue / 127));
  }
}
