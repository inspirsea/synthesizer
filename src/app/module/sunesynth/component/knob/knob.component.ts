import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { flatMap, map, switchMap, take, takeUntil, takeLast } from 'rxjs/operators';

@Component({
  selector: 'knob',
  templateUrl: './knob.component.html'
})
export class KnobComponent implements AfterViewInit {
  @Input() label: string;
  @Input() type = 'normal';

  public value = 0;
  public delta = 0;
  public deltaStop = 0;
  public angle = -60;

  private mouseDown$: Observable<MouseEvent>;
  private mouseMove$: Observable<Event>;
  private mouseUp$: Observable<Event>;
  private valueChange$: Observable<number>;

  private shapeStops = [-22, 48, 128, 205];

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    switch(this.type) {
      case 'balansed':
        this.angle = -60;
        break;
      case 'shapes':
        this.angle = -22;
        break;
      case 'normal':
        this.angle = -60;
        break;
    }
  }

  ngAfterViewInit() {
    const knob = this.el.nativeElement.querySelector('.knob');

    this.mouseDown$ = fromEvent(knob, 'mousedown');
    this.mouseMove$ = fromEvent(document, 'mousemove');
    this.mouseUp$ = fromEvent(document, 'mouseup');

    this.valueChange$ = this.mouseDown$.pipe(
      flatMap((event: MouseEvent) => {
        return this.mouseMove$.pipe(
          map((moveEvent: MouseEvent) => {
            moveEvent.preventDefault();

            let dx = moveEvent.clientX - event.clientX;
            let dy = moveEvent.clientY - event.clientY;

            // See which one is strongest
            if (Math.abs(dx) < Math.abs(dy)) {
              return -dy;
            } else {
              return dx;
            }
          }),
          takeUntil(this.mouseUp$)
        )
      })
    );

    this.mouseDown$.subscribe(result => {
      this.delta = 0;
    });

    this.valueChange$.subscribe(result => {
      const changed = result - this.delta;

      this.delta = result;

      switch (this.type) {
        case 'balanced':
          this.changeValueBalanced(changed);
          break;
        case 'normal':
          this.changeValueBalanced(changed);
          break;
        case 'shapes':
          this.changeValueShape(changed);
          break;
      }
    });
  }

  ngOnChanges(change) {

  }

  public changeValueShape(change: number): void {
    this.deltaStop += change;

    if (Math.abs(this.deltaStop) > 40) {
      if (this.deltaStop > 0) {
        this.value += 1;
      } else {
        this.value -= 1;
      }

      this.deltaStop = 0;
    }

    if (this.value < 0) {
      this.value = 0;
    }

    if (this.value > 3) {
      this.value = 3;
    }

    this.angle = this.shapeStops[this.value];
  }

  public changeValueBalanced(change: number): void {
    this.value += change;

    if (this.value > 300) {
      this.value = 300;
    } else if (this.value < 0) {
      this.value = 0;
    }

    this.angle = this.value - 60;
  }
}
