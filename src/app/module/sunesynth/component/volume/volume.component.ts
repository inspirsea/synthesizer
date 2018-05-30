import { Component } from '@angular/core';

@Component({
  selector: 'volume',
  templateUrl: './volume.component.html'
})
export class VolumeComponent {
  public volumeValue = 63;
  
  constructor() { }
}