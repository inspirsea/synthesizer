import { Component, Input, ElementRef, AfterViewInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, timer } from 'rxjs';
import { flatMap, map, switchMap, take, takeUntil, takeLast, debounce, tap } from 'rxjs/operators';

@Component({
  selector: 'fader',
  templateUrl: './fader.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FaderComponent),
      multi: true
    }
  ]
})
export class FaderComponent implements AfterViewInit, ControlValueAccessor {
  @Input() label: string;

  private mouseDown$: Observable<MouseEvent>;
  private mouseMove$: Observable<Event>;
  private mouseUp$: Observable<Event>;
  private valueChange$: Observable<number>;

  private delta = 0;
  private min = 0;
  private max = 134;
  private value = 0;

  public position = 0;
  public disabled = false;

  public onChange = (value: number) => {};
  public onTouched = () => {};

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

            const dy = moveEvent.clientY - event.clientY;

            return dy;
          }),
          takeUntil(this.mouseUp$)
        );
      }),
      tap((value) => {
        const changed = value - this.delta;

        this.delta = value;

        this.changePosition(changed);
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

  public changePosition(change: number): void {
    this.position += change;

    if (this.position > this.max) {
      this.position = this.max;
    } else if (this.position < this.min) {
      this.position = this.min;
    }

    // calculate value
    const float = this.position / this.max;

    this.value = 127 - (float * 127);
  }

  public changeValue(change: number): void {
    this.value = change;

    // Calculate position
    const float = this.value / 127;

    this.position = this.max - (float * this.max);
  }
}
