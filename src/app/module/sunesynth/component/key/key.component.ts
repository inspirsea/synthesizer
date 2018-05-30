import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { SynthService } from '../../../../service/synth.service';
import { Synth } from '../../../../utils/synth';
import { fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'key',
  templateUrl: './key.component.html'
})
export class KeyComponent implements OnInit {
  @Input() type = 'whole';

  public state = false;
  public freq = 440;

  private synth: Synth;
  private mouseKeyDown$: Observable<MouseEvent>;
  private mouseKeyUp$: Observable<MouseEvent>;

  constructor(private synthService: SynthService, private el: ElementRef) { }

  ngOnInit() {
    this.mouseKeyDown$ = fromEvent(this.el.nativeElement, 'mousedown');
    this.mouseKeyUp$ = fromEvent(this.el.nativeElement, 'mouseup');

    this.mouseKeyDown$.subscribe(result => {
      this.play();
    });

    this.mouseKeyUp$.subscribe(result => {
      this.release();
    });
  }

  public play() {
    if (!this.synth || (this.synth.usedBy !== this.freq)) {
      this.synth = this.synthService.getSynth(this.freq);
    }

    this.synth.attack(this.freq);
  }

  public release() {
    if (this.synth) {
      this.synth.release();
    }
  }
}
