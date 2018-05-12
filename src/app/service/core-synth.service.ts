import { Injectable } from '@angular/core';

@Injectable()
export class CoreSynthService {
  private window = window as any;
  public audioCtx = new (this.window.AudioContext || this.window.webkitAudioContext)() as AudioContext;
}
