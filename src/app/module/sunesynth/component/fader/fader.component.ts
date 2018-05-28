import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { flatMap, map, switchMap, take, takeUntil, takeLast } from 'rxjs/operators';

@Component({
  selector: 'fader',
  templateUrl: './fader.component.html'
})
export class FaderComponent implements AfterViewInit {
  @Input() label: string;

  private mouseDown$: Observable<MouseEvent>;
  private mouseMove$: Observable<Event>;
  private mouseUp$: Observable<Event>;
  private valueChange$: Observable<number>;

  private delta = 0;

  public value = 0;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const knob = this.el.nativeElement.querySelector('.fader-knob');

    this.mouseDown$ = fromEvent(knob, 'mousedown');
    this.mouseMove$ = fromEvent(document, 'mousemove');
    this.mouseUp$ = fromEvent(document, 'mouseup');

    this.valueChange$ = this.mouseDown$.pipe(
      flatMap((event: MouseEvent) => {
        return this.mouseMove$.pipe(
          map((moveEvent: MouseEvent) => {
            moveEvent.preventDefault();

            let dy = moveEvent.clientY - event.clientY;

            return dy;
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
      console.log('Changed: ', changed, result, this.delta);

      this.delta = result;

      this.changeValue(changed);
    });
  }

  public changeValue(change: number): void {
    this.value += change;

    if (this.value > 134) {
      this.value = 134;
    } else if (this.value < 0) {
      this.value = 0;
    }
  }
}
