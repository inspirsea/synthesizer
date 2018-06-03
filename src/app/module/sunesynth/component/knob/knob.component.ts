import { Component, Input, ElementRef, AfterViewInit, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, timer } from 'rxjs';
import { flatMap, map, switchMap, take, takeUntil, takeLast, tap, debounce } from 'rxjs/operators';

@Component({
  selector: 'knob',
  templateUrl: './knob.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KnobComponent),
      multi: true
    }
  ]
})
export class KnobComponent implements AfterViewInit, OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'normal';

  public value = 0;
  public delta = 0;
  public deltaStop = 0;
  public angle = -60;
  public position = 0;
  public disabled = false;

  private mouseDown$: Observable<MouseEvent>;
  private mouseMove$: Observable<Event>;
  private mouseUp$: Observable<Event>;
  private valueChange$: Observable<number>;

  private shapeStops = [-22, 48, 128, 205];

  public onChange = (value: number) => {};
  public onTouched = () => {};

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

            const dx = moveEvent.clientX - event.clientX;
            const dy = moveEvent.clientY - event.clientY;

            // See which one is strongest
            if (Math.abs(dx) < Math.abs(dy)) {
              return -dy;
            } else {
              return dx;
            }
          }),
          takeUntil(this.mouseUp$)
        );
      }),
      tap((value) => {
        const changed = value - this.delta;

        this.delta = value;

        switch (this.type) {
          case 'balanced':
            this.changePositionBalanced(changed);
            break;
          case 'normal':
            this.changePositionBalanced(changed);
            break;
          case 'shapes':
            this.changePositionShape(changed);
            break;
        }
      }),
      debounce(() => timer(50))
    );

    this.mouseDown$.subscribe(result => {
      this.delta = 0;
    });

    this.valueChange$.subscribe(result => {
      this.writeValue(this.value);
    });
  }

  public writeValue(value: number): void {
    if (value === undefined) {
      value = 0;
    }

    this.onChange(value);
    this.changeValue(value);
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public changePositionShape(change: number): void {
    this.deltaStop += change;

    if (Math.abs(this.deltaStop) > 40) {
      if (this.deltaStop > 0) {
        this.value += 1;
      } else {
        this.value -= 1;
      }

      this.deltaStop = 0;

      if (this.value < 0) {
        this.value = 0;
      }

      if (this.value > 3) {
        this.value = 3;
      }

      this.angle = this.shapeStops[this.value];
    }
  }

  public changePositionBalanced(change: number): void {
    this.position += change;

    if (this.position > 300) {
      this.position = 300;
    } else if (this.position < 0) {
      this.position = 0;
    }

    this.angle = this.position - 60;

    const float = this.position / 300;

    this.value = 127 * float;
  }

  public changeValue(change: number): void {
    let float: number;

    this.value = change;

    switch(this.type) {
      case 'balanced':
        float = this.value / 127;
        this.position = float * 300;
        this.angle = this.position - 60;
        break;
      case 'normal':
        float = this.value / 127;
        this.position = float * 300;
        this.angle = this.position - 60;
        break;
      case 'shapes':
        this.angle = this.shapeStops[this.value];
        break;
    }
  }
}
