import { Component } from '@angular/core';

@Component({
  selector: 'noise',
  templateUrl: './noise.component.html'
})
export class NoiseComponent {
  public typeValue: 0;
  public mixValue: 0;

  constructor() { }

  public update(): void {
    let mix = (this.mixValue / 127) * 100;

    // Update the mix with mix.
  }
}
